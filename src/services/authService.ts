import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

export function listenToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await setDoc(
    doc(db, "users", result.user.uid),
    {
      uid: result.user.uid,
      displayName: result.user.displayName ?? "",
      email: result.user.email ?? "",
      photoURL: result.user.photoURL ?? "",
      lastLoginAt: serverTimestamp(),
    },
    { merge: true },
  );
  return result.user;
}

export function logout() {
  return signOut(auth);
}
