import ButtonComponent from "@/components/Button";
import FaceIdSettings from "@/components/FaceIdSettings";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

const AccountScreen = () => {
  const { signOut, signOutAndClear } = useAuth();

  const onPressGraphQL = () => {
    router.push("/graphqlZero");
  };

  const onRecordVideo = () => {
    router.push("/recordVideo");
  };

  const onPressFlashList = () => {
    router.push("/flashList");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/account.png")}
          style={{
            height: 150,
            width: 150,
            bottom: 0,
            left: 25,
            position: "absolute",
          }}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Account Details
        </ThemedText>
      </ThemedView>

      <FaceIdSettings containerStyle={styles.faceIdContainer} />
      <ButtonComponent title={"Record a video"} onPress={onRecordVideo} />

      {/* <ButtonComponent title={"FlashList"} onPress={onPressFlashList} />
      <ButtonComponent title={"GraphQL"} onPress={onPressGraphQL} /> */}

      <View style={{ flex: 1 }}>
        <ButtonComponent title={"Sign out"} onPress={signOut} />
      </View>

      <View style={{ flex: 1 }}>
        <ButtonComponent
          title={"Sign out & Clear DB"}
          onPress={signOutAndClear}
        />
      </View>
    </ParallaxScrollView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  faceIdContainer: {
    marginVertical: 16,
  },
});
