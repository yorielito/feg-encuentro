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
import type { EventItem } from "../types/event";

export async function listHomeEvents(): Promise<EventItem[]> {
  const nowIso = new Date().toISOString();

  const q = query(
    collection(db, "events"),
    where("isPublished", "==", true),
    where("isArchived", "==", false),
    where("showOnHome", "==", true),
    where("status", "==", "upcoming"),
    where("startAt", ">=", nowIso),
    orderBy("startAt", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<EventItem, "id">),
  }));
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
