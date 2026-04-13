import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { SiteSettingsData } from "../types/siteSettings";

export async function getSiteSettings(): Promise<SiteSettingsData | null> {
  const ref = doc(db, "siteSettings", "main");
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;
  return snapshot.data() as SiteSettingsData;
}
