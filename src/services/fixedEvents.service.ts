import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import type { FixedEventItem } from "../types/fixedEvent";

export async function listHomeFixedEvents(): Promise<FixedEventItem[]> {
  const q = query(collection(db, "fixedEvents"), orderBy("sortOrder", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<FixedEventItem, "id">),
    }))
    .filter((item) => item.isPublished && item.showOnHome && !item.isArchived);
}
