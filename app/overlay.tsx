import { StyleSheet, Text, View } from "react-native";

const OverlayScreen = () => {
  return (
    <View style={styles.overlay} pointerEvents="auto">
      <Text
        style={{
          color: "#fff",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        Face ID required to open app
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(169, 167, 167, 1)",
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OverlayScreen;
