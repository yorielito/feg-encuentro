import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { PushTokenItem } from "../types/pushToken";

const COLLECTION = "devicePushTokens";

function sanitizeToken(token: string) {
  return token.replace(/[^\w-]/g, "_");
}

export async function savePushToken(token: string, platform: string) {
  const id = sanitizeToken(token);
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);

  const now = new Date().toISOString();

  const payload: PushTokenItem = {
    id,
    token,
    platform:
      platform === "ios" || platform === "android" ? platform : "unknown",
    notificationsEnabled: true,
    createdAt: snapshot.exists() ? snapshot.data()?.createdAt ?? now : now,
    updatedAt: now,
  };

  await setDoc(ref, payload, { merge: true });
}
