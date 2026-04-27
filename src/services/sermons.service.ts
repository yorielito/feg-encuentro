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
import type { SermonItem } from "../types/sermon";

export async function listHomeSermons(): Promise<SermonItem[]> {
  const q = query(
    collection(db, "sermons"),
    where("isPublished", "==", true),
    where("isArchived", "==", false),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<SermonItem, "id">),
    }))
    .slice(0, 4);
}

export async function listPublishedSermons(): Promise<SermonItem[]> {
  const q = query(collection(db, "sermons"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<SermonItem, "id">) }))
    .filter((item) => item.isPublished && !item.isArchived);
}

export async function getPublishedSermonById(
  sermonId: string
): Promise<SermonItem | null> {
  const ref = doc(db, "sermons", sermonId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  const item = {
    id: snapshot.id,
    ...(snapshot.data() as Omit<SermonItem, "id">),
  };

  if (!item.isPublished || item.isArchived) {
    return null;
  }

  return item;
}
