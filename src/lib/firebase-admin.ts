import "server-only";
import {
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cached: Firestore | null | undefined;

/**
 * Firestore 인스턴스를 반환합니다.
 * 필요한 환경변수가 없으면 null을 반환하므로(빌드/로컬에서 안전),
 * 호출 측은 null일 때 정적 데이터로 폴백해야 합니다.
 *
 * 필요한 환경변수:
 *  - FIREBASE_PROJECT_ID
 *  - FIREBASE_CLIENT_EMAIL
 *  - FIREBASE_PRIVATE_KEY  (줄바꿈은 \n 로 이스케이프된 형태도 허용)
 */
export function getDb(): Firestore | null {
  if (cached !== undefined) return cached;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    cached = null;
    return null;
  }

  // Vercel 등에서 개행이 \n 문자열로 저장되는 경우 복원
  privateKey = privateKey.replace(/\\n/g, "\n");

  try {
    const app: App =
      getApps().length > 0
        ? getApps()[0]!
        : initializeApp({
            credential: cert({ projectId, clientEmail, privateKey }),
          });
    cached = getFirestore(app);
    return cached;
  } catch (e) {
    console.error("[firebase-admin] init error:", e);
    cached = null;
    return null;
  }
}

export function isFirestoreConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}
