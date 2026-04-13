import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import type { EventItem } from "../types/event";

export async function listHomeEvents(): Promise<EventItem[]> {
  const q = query(collection(db, "events"), orderBy("startAt", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<EventItem, "id">) }))
    .filter((item) => item.isPublished && !item.isArchived)
    .slice(0, 6);
}

export async function listPublishedEvents(): Promise<EventItem[]> {
  const q = query(collection(db, "events"), orderBy("startAt", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<EventItem, "id">) }))
    .filter((item) => item.isPublished && !item.isArchived);
}

export async function getPublishedEventById(
  eventId: string
): Promise<EventItem | null> {
  const ref = doc(db, "events", eventId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  const item = {
    id: snapshot.id,
    ...(snapshot.data() as Omit<EventItem, "id">),
  };

  if (!item.isPublished || item.isArchived) {
    return null;
  }

  return item;
}
