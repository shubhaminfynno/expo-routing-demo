import { COLORS } from "@/constants/colors";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ButtonProps } from "../../types";
import { buttonStyles } from "./ButtonStyles";

const Button = ({
  onPress,
  loadingComponent,
  customStyle,
  labelStyle,
  title,
  isLoading = false,
  icon,
  leftIcon,
  buttonWidth,
  buttonHeight,
  textColor,
  numberOfLines,
  borderColor,
  isDebounce = true,
  disabled = false,
  customLabelContainerStyles,
  variant = "primary",
}: ButtonProps) => {
  const loadingSpinAnimation = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    onPress && onPress();
  };

  const getButtonVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: COLORS.gray,
          borderColor: COLORS.gray,
        };
      case "danger":
        return {
          backgroundColor: COLORS.danger,
          borderColor: COLORS.danger,
        };
      case "outlined":
        return {
          backgroundColor: COLORS.white,
          borderColor: COLORS.border,
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
        };
    }
  };

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(loadingSpinAnimation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      loadingSpinAnimation.setValue(0);
    }
  }, [isLoading]);

  const spinRotation = loadingSpinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
      style={[
        buttonStyles.buttonContainer,
        getButtonVariantStyles(),
        borderColor && { borderColor },
        {
          width: buttonWidth || "100%",
          height: buttonHeight || 48,
        },
        customStyle,
        (isLoading || disabled) && { opacity: 0.5 },
      ]}
    >
      {leftIcon && <View style={{ marginEnd: 5 }}>{leftIcon}</View>}
      {isLoading ? (
        loadingComponent ? (
          loadingComponent()
        ) : (
          <View style={{ flex: 1, alignItems: "center" }}>
            <ActivityIndicator size={"large"} />
          </View>
        )
      ) : (
        <View
          style={[buttonStyles.buttonLabelWrapper, customLabelContainerStyles]}
        >
          {typeof title === "string" ? (
            <Text
              numberOfLines={numberOfLines || 1}
              style={[
                buttonStyles.buttonText,
                {
                  color:
                    variant === "outlined" || variant === "secondary"
                      ? COLORS.neutralShades[900]
                      : textColor || COLORS.white,
                },
                labelStyle,
              ]}
            >
              {title}
            </Text>
          ) : (
            title
          )}
        </View>
      )}
      {icon && <View style={{ marginStart: 5 }}>{icon}</View>}
    </TouchableOpacity>
  );
};

export default Button;
