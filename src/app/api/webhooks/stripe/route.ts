import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing stripe-signature or STRIPE_WEBHOOK_SECRET" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id ?? session.metadata?.userId;
      const customerId = session.customer as string | null;
      const subId = session.subscription as string | null;
      if (!userId || !subId) break;

      const subscription = await stripe.subscriptions.retrieve(subId);
      const status = subscription.status;
      const periodEnd = new Date((subscription.current_period_end ?? 0) * 1000);
      const meta = session.metadata ?? {};
      const type = meta.type;

      if (type === "app" && meta.webAppId) {
        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: subId },
          create: {
            userId,
            stripeSubscriptionId: subId,
            stripeCustomerId: customerId ?? undefined,
            status,
            currentPeriodEnd: periodEnd,
            webAppId: meta.webAppId,
          },
          update: {
            status,
            currentPeriodEnd: periodEnd,
          },
        });
      } else if (type === "package" && meta.packageId) {
        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: subId },
          create: {
            userId,
            stripeSubscriptionId: subId,
            stripeCustomerId: customerId ?? undefined,
            status,
            currentPeriodEnd: periodEnd,
            packageId: meta.packageId,
          },
          update: {
            status,
            currentPeriodEnd: periodEnd,
          },
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : null;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          status: sub.status,
          currentPeriodEnd: periodEnd,
        },
      });
      break;
    }
    default:
      // 다른 이벤트는 무시
      break;
  }

  return NextResponse.json({ received: true });
}
