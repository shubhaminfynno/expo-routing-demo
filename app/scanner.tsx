import RoundIconButton from "@/components/roundIconButton/RoundIconButton";
import { Ionicons } from "@expo/vector-icons";
import {
  BarcodeScanningResult,
  Camera,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const FRAME_SIZE = width * 0.7;

const Scanner = () => {
  const { top } = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const [flash, setFlash] = useState(false);

  const scanLine = useRef(new Animated.Value(0)).current;

  const goBack = () => router.back();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: FRAME_SIZE,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Gallery access is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });

    if (result.canceled) return;

    try {
      setScanned(true);

      const uri = result.assets[0].uri;

      const scanned = await Camera.scanFromURLAsync(uri, [
        "qr",
        "ean13",
        "ean8",
        "code128",
      ]);

      if (!scanned.length) {
        Alert.alert(
          "No code found",
          "No QR or barcode detected in this image."
        );
        resetScan();
        return;
      }

      const { data, type } = scanned[0];

      if (type === "qr" || +type === 256) {
        await handleQR(data);
      } else {
        await handleBarcode(data);
      }
    } catch (e) {
      Alert.alert("Scan failed", "Unable to read this image.");
      resetScan();
    }
  };

  const isValidUrl = (text: string) => {
    try {
      const url = new URL(text);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const resetScan = () => setTimeout(() => setScanned(false), 1500);

  const handleBarcode = async (code: string) => {
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`
      );
      const json = await res.json();

      if (!json.product_name) {
        Alert.alert("Product not found", "This barcode is not in database");
        resetScan();
        return;
      }

      resetScan();
    } catch {
      Alert.alert("Error", "Failed to fetch product");
      resetScan();
    }
  };

  const handleQR = async (data: string) => {
    if (!isValidUrl(data)) {
      Alert.alert("Invalid QR", "This QR code does not contain a valid link.");
      resetScan();
      return;
    }

    const supported = await Linking.canOpenURL(data);
    if (!supported) {
      Alert.alert("Cannot open link", data);
      resetScan();
      return;
    }

    await Linking.openURL(data);
    resetScan();
  };

  const handleScan = async (result: BarcodeScanningResult) => {
    if (scanned) return;

    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const { data, type } = result;

    if (type === "qr") {
      await handleQR(data);
    } else {
      await handleBarcode(data);
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#fff" }}>Camera permission required</Text>
        <RoundIconButton title="Grant" onPress={requestPermission} size={56} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={flash}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "code128"],
        }}
        onBarcodeScanned={handleScan}
      />

      <View style={styles.overlay}>
        <View style={styles.row} />
        <View style={styles.middle}>
          <View style={styles.side} />
          <View style={styles.frame}>
            <Animated.View
              style={[
                styles.scanLine,
                { transform: [{ translateY: scanLine }] },
              ]}
            />
          </View>
          <View style={styles.side} />
        </View>
        <View style={styles.row} />
      </View>

      <View style={[styles.topBar, { marginTop: top + 20 }]}>
        <RoundIconButton
          icon={<Ionicons name="close" size={22} color="#fff" />}
          onPress={goBack}
        />

        <View style={{ flexDirection: "row", gap: 12 }}>
          <RoundIconButton
            icon={<Ionicons name="images" size={22} color="#fff" />}
            onPress={pickFromGallery}
          />
          <RoundIconButton
            icon={
              <Ionicons
                name={flash ? "flash" : "flash-off"}
                size={22}
                color="#fff"
              />
            }
            onPress={() => setFlash(!flash)}
          />
        </View>
      </View>

      <View style={styles.hint}>
        <Text style={styles.hintText}>Align QR or barcode inside frame</Text>
      </View>
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  row: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  middle: {
    flexDirection: "row",
  },
  side: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 2,
    borderColor: "#00ff9c",
    overflow: "hidden",
  },

  scanLine: {
    height: 2,
    width: "100%",
    backgroundColor: "#00ff9c",
    opacity: 0.9,
  },

  topBar: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },

  hint: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
  },
  hintText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
