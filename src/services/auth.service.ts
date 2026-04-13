import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { signInAnonymously } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export type AuthStateListener = (user: User | null) => void;

export function subscribeToAuthChanges(listener: AuthStateListener) {
  return onAuthStateChanged(auth, listener);
}

export async function logout() {
  await signOut(auth);
}

export async function ensureAnonymousUser() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
    console.log("👤 Usuario anónimo creado");
  }
}

export function useGoogleRequest() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  return { request, response, promptAsync };
}

export async function signInWithGoogleIdToken(idToken: string) {
  const credential = GoogleAuthProvider.credential(idToken);
  await signInWithCredential(auth, credential);
}
