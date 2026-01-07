import { router, usePathname } from "expo-router";
import { ReactNode, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuth } from "./AuthProvider";

type Props = {
  children: ReactNode;
};

const UserInactivityProvider = ({ children }: Props) => {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const backgroundTime = useRef<number | null>(null);
  const overlayShown = useRef<boolean>(false);
  const pathname = usePathname();
  const { isSignedIn, isLoaded, isVerified } = useAuth();

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const prevAppState = appState.current;

      if (!isLoaded || !isSignedIn || !isVerified) {
        appState.current = nextAppState;
        return;
      }

      switch (nextAppState) {
        case "inactive":
          overlayShown.current = true;
          router.navigate("/overlay");
          break;

        case "background":
          backgroundTime.current = Date.now();
          break;

        case "active":
          if (overlayShown.current && pathname === "/overlay") {
            overlayShown.current = false;
            router.back();
          }

          // Handle lock screen for background timeout
          if (prevAppState === "background" && backgroundTime.current) {
            const timeInBackground = Date.now() - backgroundTime.current;
            if (timeInBackground >= 3000) {
              router.navigate("/lock");
            }
            backgroundTime.current = null;
          }
          break;
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [pathname]);

  return <>{children}</>;
};

export default UserInactivityProvider;
