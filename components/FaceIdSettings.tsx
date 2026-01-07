// import { useAuth } from "@/providers/AuthProvider";
// import React, { useState } from "react";
// import { Alert, StyleSheet, Switch, View } from "react-native";
// import { ThemedText } from "./themed-text";

// interface FaceIdSettingsProps {
//   containerStyle?: any;
// }

// const FaceIdSettings: React.FC<FaceIdSettingsProps> = ({ containerStyle }) => {
//   const { activeUser, toggleFaceId, isBiometricAvailable, biometricType } =
//     useAuth();

//   const [isLoading, setIsLoading] = useState(false);

//   const handleToggleFaceId = async (enabled: boolean) => {
//     if (!isBiometricAvailable) {
//       Alert.alert(
//         "Not Available",
//         `${biometricType} is not available on this device or not set up.`,
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await toggleFaceId(enabled);
//     } catch (error) {
//       Alert.alert(
//         "Authentication Failed",
//         `Failed to ${
//           enabled ? "enable" : "disable"
//         } ${biometricType}. Please try again.`,
//         [{ text: "OK" }]
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isBiometricAvailable) {
//     return (
//       <View style={[styles.container, containerStyle]}>
//         <View style={styles.row}>
//           <View style={styles.textContainer}>
//             <ThemedText style={styles.title}>{biometricType}</ThemedText>
//             <ThemedText style={styles.subtitle}>
//               Not available on this device
//             </ThemedText>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, containerStyle]}>
//       <View style={styles.row}>
//         <View style={styles.textContainer}>
//           <ThemedText style={styles.title}>{biometricType}</ThemedText>
//           <ThemedText style={styles.subtitle}>
//             Use {biometricType} to sign in quickly and securely
//           </ThemedText>
//         </View>
//         <Switch
//           value={Boolean(activeUser?.faceIdEnabled)}
//           onValueChange={handleToggleFaceId}
//           disabled={isLoading}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#f8f9fa",
//     borderRadius: 12,
//     padding: 16,
//     marginVertical: 8,
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   textContainer: {
//     flex: 1,
//     marginRight: 16,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#6b7280",
//   },
// });

// export default FaceIdSettings;
