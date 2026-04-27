import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { PrayerEventItem } from "../types/prayerEvent";

export async function listHomePrayerEvents(): Promise<PrayerEventItem[]> {
  const q = query(
    collection(db, "prayerEvents"),
    where("isPublished", "==", true),
    where("isArchived", "==", false),
    where("showOnHome", "==", true),
    where("status", "==", "upcoming"),
    orderBy("startDate", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<PrayerEventItem, "id">),
    }))
    .slice(0, 3);
}

export async function listPublishedPrayerEvents(): Promise<PrayerEventItem[]> {
  const q = query(collection(db, "prayerEvents"), orderBy("startDate", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<PrayerEventItem, "id">),
    }))
    .filter((item) => item.isPublished && !item.isArchived);
}

export async function getPublishedPrayerEventById(
  prayerEventId: string
): Promise<PrayerEventItem | null> {
  const ref = doc(db, "prayerEvents", prayerEventId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  const item = {
    id: snapshot.id,
    ...(snapshot.data() as Omit<PrayerEventItem, "id">),
  };

  if (!item.isPublished || item.isArchived) {
    return null;
  }

  return item;
}
