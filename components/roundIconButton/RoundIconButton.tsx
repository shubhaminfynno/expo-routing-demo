import React from "react";
import { Platform, Pressable, Text, View, ViewStyle } from "react-native";

type RoundIconButtonProps = {
  size?: number;
  icon?: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  disabled?: boolean;
  glassy?: boolean;
  blurIntensity?: number;
  glassTint?: "light" | "dark";
  onPress?: () => void;
  style?: ViewStyle;
  activeOpacity?: number;
  title?: string;
};

const RoundIconButton: React.FC<RoundIconButtonProps> = ({
  size = 42,
  icon,
  backgroundColor = "rgba(0,0,0,0.3)",
  borderColor = "rgba(255,255,255,0.25)",
  borderWidth = 1,
  disabled = false,
  glassy = Platform.OS === "ios",
  onPress,
  style,
  activeOpacity = 0.7,
  title,
}) => {
  const radius = size / 2;

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    borderWidth,
    borderColor,
    backgroundColor: glassy ? "transparent" : backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  };

  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          containerStyle,
          pressed && { opacity: activeOpacity },
          style,
        ]}
      >
        {icon}
      </Pressable>
      <Text style={{ fontSize: 12, fontWeight: "bold", color: "#fff" }}>
        {title}
      </Text>
    </View>
  );
};

export default RoundIconButton;
