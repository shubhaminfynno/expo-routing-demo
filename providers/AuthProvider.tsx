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
  // authenticateWithBiometrics: () => Promise<boolean>;
  // toggleFaceId: (enabled: boolean) => Promise<void>;
  // isBiometricAvailable: boolean;
  // biometricType: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  // const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  // const [biometricType, setBiometricType] = useState<string>(
  //   "Biometric Authentication"
  // );

  useEffect(() => {
    const hydrateSession = async () => {
      const storedUser = await getActiveUser();
      if (storedUser?.isAuthenticated) {
        setActiveUser(storedUser);
        setIsSignedIn(true);
      }

      // // Check biometric availability
      // const isAvailable = await faceIdService.isAvailable();
      // setIsBiometricAvailable(isAvailable);

      // if (isAvailable) {
      //   const primaryBiometricName =
      //     await faceIdService.getPrimaryBiometricName();
      //   setBiometricType(primaryBiometricName);
      // }

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

  // const authenticateWithBiometrics = useCallback(async (): Promise<boolean> => {
  //   if (!activeUser?.faceIdEnabled || !isBiometricAvailable) {
  //     return false;
  //   }

  //   try {
  //     const result = await faceIdService.authenticate(
  //       `Use ${biometricType} to sign in to your account`
  //     );
  //     return result.success;
  //   } catch (error) {
  //     console.error("Biometric authentication failed:", error);
  //     return false;
  //   }
  // }, [activeUser?.faceIdEnabled, isBiometricAvailable, biometricType]);

  // const toggleFaceId = useCallback(
  //   async (enabled: boolean) => {
  //     if (!activeUser) return;

  //     // If enabling Face ID, require authentication first
  //     if (enabled && isBiometricAvailable) {
  //       const result = await faceIdService.authenticate(
  //         `Enable ${biometricType} for future sign-ins`
  //       );
  //       if (!result.success) {
  //         throw new Error("Authentication required to enable biometric login");
  //       }
  //     }

  //     const updatedUser = { ...activeUser, faceIdEnabled: enabled };
  //     setActiveUser(updatedUser);
  //     await setItemInStorage("activeUser", updatedUser);
  //     await syncUserStore(updatedUser);
  //   },
  //   [activeUser, isBiometricAvailable, biometricType, syncUserStore]
  // );

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
      // authenticateWithBiometrics,
      // toggleFaceId,
      // isBiometricAvailable,
      // biometricType,
    }),
    [
      isSignedIn,
      activeUser,
      signIn,
      signOut,
      isLoaded,
      signOutAndClear,
      markVerified,
      // authenticateWithBiometrics,
      // toggleFaceId,
      // isBiometricAvailable,
      // biometricType,
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
