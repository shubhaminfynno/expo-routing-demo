import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { GlobalStyles } from "../../styles/globalStyles";
import { ContainerProps } from "../../types";

const Container = ({
  containerStyles,
  children,
  avoidKeyboard,
}: ContainerProps) => {
  return avoidKeyboard ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? undefined : "padding"}
      style={[
        GlobalStyles.bgWhite,
        GlobalStyles.flex,
        GlobalStyles.p16,
        containerStyles,
      ]}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View
      style={[
        GlobalStyles.bgWhite,
        GlobalStyles.flex,
        GlobalStyles.p16,
        containerStyles,
      ]}
    >
      {children}
    </View>
  );
};

export default Container;
