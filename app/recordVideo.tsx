import Button from "@/components/button/Button";
import RoundIconButton from "@/components/roundIconButton/RoundIconButton";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RecordVideo = () => {
  const { top } = useSafeAreaInsets();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();

  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const timerRef = useRef<any>(null);
  const isRecordingMode = isRecording && !videoUri;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (micPermission && !micPermission.granted && micPermission.canAskAgain) {
      requestMicPermission();
    }
  }, [micPermission]);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.5,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 500,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }
  }, [isRecording]);

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash(!flash);
  };

  const goBack = () => {
    router.back();
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;

    setIsRecording(true);
    setDuration(0);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setDuration(elapsed);
    }, 1000);

    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: 15 });
      if (video) {
        setVideoUri(video.uri);
      }
    } catch (error) {
      console.error("Recording failed", error);
      Alert.alert("Error", "Failed to record video");
    } finally {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const saveVideo = async () => {
    if (!videoUri) return;
    try {
      if (!mediaLibraryPermission?.granted) {
        const permission = await requestMediaLibraryPermission();
        if (!permission.granted) {
          Alert.alert(
            "Permission required",
            "Please grant permission to save video."
          );
          return;
        }
      }
      await MediaLibrary.saveToLibraryAsync(videoUri);
      Alert.alert("Saved", "Video saved to gallery!");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save video.");
    }
  };

  const shareVideo = async () => {
    if (!videoUri) return;
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(videoUri);
    } else {
      Alert.alert("Error", "Sharing is not available on this device");
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "videos",
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 15000,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        if (asset.duration && asset.duration > 15000) {
          Alert.alert(
            "Video too long",
            "Please select a video that is 15 seconds or shorter."
          );
          return;
        }

        setVideoUri(asset.uri);
        setDuration(Math.floor((asset.duration || 0) / 1000));
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Error", "Failed to select video from gallery");
    }
  };

  const discardVideo = () => {
    setVideoUri(null);
    setDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>
          We don't have permission to show the camera.
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>
          We need your permission to show the camera.
        </Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  if (videoUri) {
    return (
      <View style={styles.container}>
        <Video
          source={{ uri: videoUri }}
          style={styles.camera}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
        />
        <View style={[styles.topBar, { marginTop: top + 24 }]}>
          <RoundIconButton
            icon={<Ionicons name="close" size={24} color="#fff" />}
            onPress={discardVideo}
          />
        </View>
        <View style={styles.bottomBar}>
          <RoundIconButton
            icon={<Ionicons name="trash" size={24} color="#fff" />}
            onPress={discardVideo}
            size={52}
            title="Discard"
          />
          <RoundIconButton
            icon={<Ionicons name="download" size={24} color="#fff" />}
            onPress={saveVideo}
            size={72}
            backgroundColor="#FF3B30"
            glassy={false}
            style={{ borderWidth: 4, borderColor: "#fff" }}
          />
          <RoundIconButton
            icon={<Ionicons name="share-outline" size={24} color="#fff" />}
            onPress={shareVideo}
            size={52}
            title="Share"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="video"
        pointerEvents="none"
        enableTorch={flash}
      />

      {!isRecordingMode && (
        <View style={[styles.topBar, { marginTop: top + 24 }]}>
          <RoundIconButton
            icon={<Ionicons name="close" size={24} color="#fff" />}
            onPress={goBack}
          />

          <View style={styles.headerView}>
            <Text style={styles.headerTitle}>Juggle Master</Text>
          </View>

          <RoundIconButton
            icon={<Ionicons name="camera-reverse" size={24} color="#fff" />}
            onPress={toggleCameraFacing}
          />
        </View>
      )}

      <View
        style={[
          styles.topBar,
          styles.flashContainer,
          { marginTop: isRecordingMode ? top + 24 : top + 96 },
        ]}
      >
        <RoundIconButton
          icon={
            <Ionicons
              name={flash ? "flash" : "flash-off"}
              size={24}
              color="#fff"
            />
          }
          onPress={toggleFlash}
        />
      </View>

      {!isRecordingMode && (
        <View
          style={[
            styles.titleContainer,
            {
              marginTop: top + 240,
            },
          ]}
        >
          <View style={[styles.titlePill]}>
            <Text style={styles.title}>Show us your moves!</Text>
            <Text style={styles.subTitle}>
              Record a clip under 15 seconds to earn badge
            </Text>
          </View>
        </View>
      )}

      <View style={styles.bottomTimer}>
        <View style={styles.glassPill}>
          <Animated.View
            style={[
              styles.videoDot,
              {
                transform: [{ scale: pulse }],
              },
            ]}
          />
          <Text style={styles.timerText}>
            {formatTime(duration)}{" "}
            <Text style={styles.totalTimerText}>/ 00:15</Text>
          </Text>
        </View>
      </View>

      <View
        style={[styles.bottomBar, isRecording && { justifyContent: "center" }]}
      >
        {!isRecordingMode && (
          <RoundIconButton
            icon={<Ionicons name="image" size={24} color="#fff" />}
            onPress={openGallery}
            size={52}
            title="Gallery"
          />
        )}

        <RoundIconButton
          size={72}
          backgroundColor="#FF3B30"
          glassy={false}
          onPress={handleRecordPress}
          style={{ borderWidth: 4, borderColor: "#fff" }}
          icon={
            isRecording ? (
              <Ionicons name="square" size={24} color="#fff" />
            ) : undefined
          }
        />

        {!isRecordingMode && (
          <RoundIconButton
            icon={<Ionicons name="phone-portrait" size={24} color="#fff" />}
            onPress={() => {}}
            size={52}
            title="Portrait"
          />
        )}
      </View>

      <View style={[styles.maxTextBottom]}>
        <View style={styles.glassPill}>
          <Ionicons name="card" size={16} color="#b9b9b9ff" />
          <Text style={styles.maxText}>Max 50MB</Text>
        </View>
      </View>
    </View>
  );
};

export default RecordVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  message: {
    textAlign: "center",
    marginBottom: 12,
  },
  camera: {
    flex: 1,
  },
  topBar: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 999,
  },
  flashContainer: {
    justifyContent: "flex-end",
  },
  headerView: {
    borderRadius: 26,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    bottom: 12,
  },
  headerTitle: {
    fontWeight: "600",
    color: "#fff",
  },
  titleContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    gap: 12,
  },
  title: {
    fontWeight: "800",
    color: "#fff",
    fontSize: 24,
  },
  subTitle: {
    fontWeight: "600",
    color: "#fff",
    fontSize: 16,
  },
  bottomTimer: {
    position: "absolute",
    bottom: 180,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  bottomBar: {
    position: "absolute",
    bottom: 64,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    zIndex: 999,
  },
  maxTextBottom: {
    position: "absolute",
    bottom: 32,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  timerText: {
    fontSize: 24,
    color: "#fff",
  },
  totalTimerText: {
    fontSize: 18,
    color: "#b9b9b9ff",
  },
  maxText: {
    fontSize: 12,
    color: "#b9b9b9ff",
  },
  videoDot: {
    backgroundColor: "#FF3B30",
    width: 10,
    height: 10,
    borderRadius: 50,
    top: 1,
  },
  glassPill: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 4,
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  titlePill: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
  },
});
