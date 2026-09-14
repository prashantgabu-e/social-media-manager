import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { defaultTimezone } from "../types/options";

export async function getUserSettings(uid: string) {
  const ref = doc(db, "settings", uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    const defaults = {
      timezone: defaultTimezone,
      brandName: "Dare & Rise",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, defaults, { merge: true });
    return { timezone: defaultTimezone, brandName: "Dare & Rise" };
  }
  const data = snapshot.data();
  return {
    timezone: data.timezone ?? defaultTimezone,
    brandName: data.brandName ?? "Dare & Rise",
  };
}

export function updateUserSettings(uid: string, settings: { timezone: string; brandName: string }) {
  return setDoc(
    doc(db, "settings", uid),
    {
      ...settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
