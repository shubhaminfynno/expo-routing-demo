import { COLORS } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  bgWhite: {
    backgroundColor: "white",
  },
  bgGreen: {
    backgroundColor: "green",
  },
  pv16: {
    paddingVertical: 16,
  },
  ph16: {
    paddingHorizontal: 16,
  },
  p16: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
  },

  lgSemibold: {
    fontSize: 24,
    lineHeight: 28,
    color: COLORS.neutralShades[900],
  },
  lgMedium: {
    fontSize: 24,
    lineHeight: 28,
    color: COLORS.neutralShades[900],
  },
  lgRegular: {
    fontSize: 24,
    lineHeight: 28,
    color: COLORS.neutralShades[900],
  },
  mdSemibold: {
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.neutralShades[900],
  },
  mdMd: {
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.neutralShades[900],
  },
  mdRegular: {
    fontSize: 20,
    lineHeight: 24,
    color: COLORS.neutralShades[900],
  },
});
