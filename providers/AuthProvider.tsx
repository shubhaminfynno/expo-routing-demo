import {
  clearStorage,
  getActiveUser,
  getUsers,
  removeItemFromStorage,
  setItemInStorage,
} from "@/helper";
import { User } from "@/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextValue = {
  isSignedIn: boolean;
  isLoaded: boolean;
  isVerified: boolean;
  activeUser: User | null;
  signIn: (user?: User) => Promise<void>;
  signOut: () => Promise<void>;
  signOutAndClear: () => Promise<void>;
  markVerified: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);

  useEffect(() => {
    const hydrateSession = async () => {
      const storedUser = await getActiveUser();
      if (storedUser?.isAuthenticated) {
        setActiveUser(storedUser);
        setIsSignedIn(true);
      }
      setIsLoaded(true);
    };
    hydrateSession();
  }, []);

  const syncUserStore = useCallback(async (user: User) => {
    const existingUsers = (await getUsers()) || [];
    const hasUser = existingUsers.some((u: User) => u.id === user.id);
    const nextUsers = hasUser
      ? existingUsers.map((u: User) => (u.id === user.id ? user : u))
      : [...existingUsers, user];
    await setItemInStorage("users", nextUsers);
  }, []);

  const signIn = useCallback(
    async (user?: User) => {
      const targetUser =
        user || (await getActiveUser()) || activeUser || undefined;
      if (!targetUser) return;
      const normalizedUser = { ...targetUser, isAuthenticated: true };
      await setItemInStorage("activeUser", normalizedUser);
      await syncUserStore(normalizedUser);
      setActiveUser(normalizedUser);
      setIsSignedIn(true);
    },
    [activeUser, syncUserStore]
  );

  const signOut = useCallback(async () => {
    setIsSignedIn(false);
    setActiveUser(null);
    await removeItemFromStorage("activeUser");
  }, []);

  const signOutAndClear = useCallback(async () => {
    setIsSignedIn(false);
    setActiveUser(null);
    await clearStorage();
  }, []);

  const markVerified = useCallback(async () => {
    if (!activeUser) return;
    const updatedUser = { ...activeUser, isVerified: true };
    setActiveUser(updatedUser);
    await setItemInStorage("activeUser", updatedUser);
    await syncUserStore(updatedUser);
  }, [activeUser, syncUserStore]);

  const value = useMemo(
    () => ({
      isSignedIn,
      isVerified: Boolean(activeUser?.isVerified),
      activeUser,
      signIn,
      signOut,
      isLoaded,
      signOutAndClear,
      markVerified,
    }),
    [
      isSignedIn,
      activeUser,
      signIn,
      signOut,
      isLoaded,
      signOutAndClear,
      markVerified,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
