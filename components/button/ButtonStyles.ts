import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 6,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  buttonLabelWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
  },
  pressableButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    width: "100%",
    height: 48,
  },
});
