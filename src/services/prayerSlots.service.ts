import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import type { PrayerSlotItem } from "../types/prayerSlot";

export async function listPrayerSlots(
  prayerEventId: string
): Promise<PrayerSlotItem[]> {
  const q = query(
    collection(db, "prayerEvents", prayerEventId, "slots"),
    orderBy("startAt", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<PrayerSlotItem, "id">),
  }));
}
