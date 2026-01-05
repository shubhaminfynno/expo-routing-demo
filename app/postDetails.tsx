import ButtonComponent from "@/components/Button";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, View } from "react-native";

const PostDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    body: string;
    isLocal?: string;
  }>();

  const borderColor = useThemeColor({}, "border");
  const bgColor = useThemeColor({}, "background");

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={{
            height: 178,
            width: 290,
            bottom: 0,
            left: 0,
            position: "absolute",
          }}
        />
      }
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40, gap: 16 }}>
        <View style={{ marginTop: 24, gap: 6 }}>
          <ThemedText type="title">Post Details</ThemedText>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor,
            borderRadius: 12,
            padding: 16,
            gap: 12,
            backgroundColor: bgColor,
          }}
        >
          <View style={{ gap: 4 }}>
            <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>ID</ThemedText>
            <ThemedText style={{ fontWeight: "600" }}>{params.id}</ThemedText>
          </View>

          <View style={{ gap: 4 }}>
            <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
              Title
            </ThemedText>
            <ThemedText style={{ fontWeight: "700", fontSize: 18 }}>
              {params.title}
            </ThemedText>
          </View>

          <View style={{ gap: 4 }}>
            <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>Body</ThemedText>
            <ThemedText style={{ opacity: 0.9, lineHeight: 24 }}>
              {params.body}
            </ThemedText>
          </View>

          {params.isLocal === "true" && (
            <View
              style={{
                padding: 8,
                backgroundColor: "rgba(255, 193, 7, 0.2)",
                borderRadius: 6,
              }}
            >
              <ThemedText style={{ fontSize: 12, opacity: 0.8 }}>
                This is a locally created post
              </ThemedText>
            </View>
          )}
        </View>

        <ButtonComponent title="Back" onPress={() => router.back()} />
      </ScrollView>
    </ParallaxScrollView>
  );
};

export default PostDetailsScreen;
