import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import {
  ensureAnonymousUser,
  logout as firebaseLogout,
  subscribeToAuthChanges,
} from "../services/auth.service";
import { registerForPushNotificationsAsync } from "../hooks/usePushNotifications";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    async function initAuth() {
      try {
        await ensureAnonymousUser();

        unsub = subscribeToAuthChanges(async (nextUser) => {
          console.log("👤 Auth change:", nextUser);

          setUser(nextUser);

          if (nextUser) {
            console.log("🚀 calling setupPush");
            await setupPush(nextUser.uid);
          }

          setLoading(false);
        });
      } catch (error) {
        console.error("❌ initAuth error:", error);
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  async function logout() {
    await firebaseLogout();
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      logout,
    }),
    [user, loading]
  );

  async function setupPush(userId: string) {
    try {
      const token = await registerForPushNotificationsAsync();

      if (!token) return;

      await setDoc(
        doc(db, "users", userId),
        {
          expoPushToken: token,
        },
        { merge: true }
      );

      console.log("✅ Push token guardado");
    } catch (err) {
      console.error("❌ Error setupPush:", err);
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
