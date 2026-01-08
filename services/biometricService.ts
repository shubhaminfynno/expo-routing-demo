import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: LocalAuthentication.AuthenticationType;
}

class FaceIdService {
  /**
   * Check if biometric authentication is available on the device
   */
  async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      return false;
    }
  }

  /**
   * Get available biometric types
   */
  async getSupportedAuthenticationTypes(): Promise<
    LocalAuthentication.AuthenticationType[]
  > {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error("Error getting supported authentication types:", error);
      return [];
    }
  }

  /**
   * Check if Face ID is specifically available (iOS)
   */
  async isFaceIdAvailable(): Promise<boolean> {
    if (Platform.OS !== "ios") return false;

    try {
      const supportedTypes = await this.getSupportedAuthenticationTypes();
      return supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      );
    } catch (error) {
      console.error("Error checking Face ID availability:", error);
      return false;
    }
  }

  /**
   * Authenticate using biometrics
   */
  async authenticate(reason?: string): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: "Biometric authentication is not available on this device",
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason || "Authenticate to continue",
        cancelLabel: "Cancel",
        fallbackLabel: "Use Passcode",
        disableDeviceFallback: false,
      });

      if (result.success) {
        const supportedTypes = await this.getSupportedAuthenticationTypes();
        return {
          success: true,
          biometricType: supportedTypes[0], // Primary biometric type
        };
      } else {
        return {
          success: false,
          error: result.error || "Authentication failed",
        };
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      return {
        success: false,
        error: "Authentication error occurred",
      };
    }
  }

  /**
   * Get a user-friendly name for the biometric type
   */
  getBiometricTypeName(type: LocalAuthentication.AuthenticationType): string {
    switch (type) {
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return Platform.OS === "ios" ? "Face ID" : "Face Recognition";
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return Platform.OS === "ios" ? "Touch ID" : "Fingerprint";
      case LocalAuthentication.AuthenticationType.IRIS:
        return "Iris Recognition";
      default:
        return "Biometric Authentication";
    }
  }

  /**
   * Get the primary biometric authentication name for the device
   */
  async getPrimaryBiometricName(): Promise<string> {
    try {
      const supportedTypes = await this.getSupportedAuthenticationTypes();
      if (supportedTypes.length > 0) {
        return this.getBiometricTypeName(supportedTypes[0]);
      }
      return "Biometric Authentication";
    } catch (error) {
      console.error("Error getting primary biometric name:", error);
      return "Biometric Authentication";
    }
  }
}

export const faceIdService = new FaceIdService();
