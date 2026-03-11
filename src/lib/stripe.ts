import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret && process.env.NODE_ENV === "production") {
  console.warn("STRIPE_SECRET_KEY is not set. Payments will not work.");
}

export const stripe = secret
  ? new Stripe(secret, { apiVersion: "2025-02-24.acacia" })
  : null;

/** 개별 앱 구독용 Checkout 세션 생성 */
export async function createAppCheckoutSession(params: {
  priceId: string;
  userId: string;
  userEmail: string;
  webAppId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string | null> {
  if (!stripe) return null;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: params.priceId, quantity: 1 }],
    customer_email: params.userEmail,
    client_reference_id: params.userId,
    metadata: {
      type: "app",
      webAppId: params.webAppId,
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: {
      metadata: {
        type: "app",
        webAppId: params.webAppId,
        userId: params.userId,
      },
    },
  });
  return session.url;
}

/** 패키지 구독용 Checkout 세션 생성 */
export async function createPackageCheckoutSession(params: {
  priceId: string;
  userId: string;
  userEmail: string;
  packageId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string | null> {
  if (!stripe) return null;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: params.priceId, quantity: 1 }],
    customer_email: params.userEmail,
    client_reference_id: params.userId,
    metadata: {
      type: "package",
      packageId: params.packageId,
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: {
      metadata: {
        type: "package",
        packageId: params.packageId,
        userId: params.userId,
      },
    },
  });
  return session.url;
}
