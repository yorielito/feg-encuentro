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
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { registerDevicePushToken } from "../services/push.service";

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
        ensureAnonymousUser();

        unsub = subscribeToAuthChanges(async (nextUser) => {
          setUser(nextUser);

          console.log("auth user", nextUser?.uid);

          if (nextUser) {
            if (nextUser) {
              console.log("🚀 registering device push token");
              await registerDevicePushToken(nextUser.uid);
            }
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
