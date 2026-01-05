import ButtonComponent from "@/components/Button";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { useAnimeById } from "@/hooks/queryHooks";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
// import { ANIME_HEADER_IMAGE } from "./(tabs)/anime";

const AnimeDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    title: string;
  }>();

  const {
    data: anime,
    isLoading,
    error,
  } = useAnimeById(parseInt(params.id || "0"));

  const borderColor = useThemeColor({}, "border");
  const bgColor = useThemeColor({}, "background");
  const placeholderBg = useThemeColor(
    { light: "rgba(0,0,0,0.05)", dark: "rgba(255,255,255,0.06)" },
    "background"
  );

  if (isLoading) {
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
        <View style={{ marginTop: 60, alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </ParallaxScrollView>
    );
  }

  if (error || !anime) {
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
        <View style={{ marginTop: 60, gap: 12, padding: 16 }}>
          <ThemedText type="title">Anime Details</ThemedText>
          <ThemedText>Failed to load anime details.</ThemedText>
          <ButtonComponent title="Back" onPress={() => router.back()} />
        </View>
      </ParallaxScrollView>
    );
  }

  const displayTitle =
    anime.title?.english || anime.title?.romaji || params.title;
  const description = anime.description
    ? anime.description.replace(/<[^>]*>/g, "").substring(0, 500)
    : "No description available.";

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
          <ThemedText type="title">Anime Details</ThemedText>
        </View>

        {anime.coverImage?.large && (
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: anime.coverImage.large }}
              style={{
                width: "100%",
                height: 300,
                borderRadius: 12,
                resizeMode: "cover",
              }}
            />
          </View>
        )}

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
            <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
              Title
            </ThemedText>
            <ThemedText style={{ fontWeight: "700", fontSize: 20 }}>
              {displayTitle}
            </ThemedText>
            {anime.title?.native && (
              <ThemedText style={{ opacity: 0.7 }}>
                {anime.title.native}
              </ThemedText>
            )}
          </View>

          {anime.description && (
            <View style={{ gap: 4 }}>
              <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                Description
              </ThemedText>
              <ThemedText style={{ opacity: 0.9, lineHeight: 22 }}>
                {description}
                {anime.description.length > 500 && "..."}
              </ThemedText>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {anime.format && (
              <View style={{ gap: 4 }}>
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                  Format
                </ThemedText>
                <ThemedText style={{ fontWeight: "600" }}>
                  {anime.format}
                </ThemedText>
              </View>
            )}

            {anime.episodes && (
              <View style={{ gap: 4 }}>
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                  Episodes
                </ThemedText>
                <ThemedText style={{ fontWeight: "600" }}>
                  {anime.episodes}
                </ThemedText>
              </View>
            )}

            {anime.status && (
              <View style={{ gap: 4 }}>
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                  Status
                </ThemedText>
                <ThemedText style={{ fontWeight: "600" }}>
                  {anime.status}
                </ThemedText>
              </View>
            )}

            {anime.averageScore && (
              <View style={{ gap: 4 }}>
                <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                  Score
                </ThemedText>
                <ThemedText style={{ fontWeight: "600" }}>
                  {anime.averageScore}%
                </ThemedText>
              </View>
            )}
          </View>

          {anime.startDate?.year && (
            <View style={{ gap: 4 }}>
              <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                Start Date
              </ThemedText>
              <ThemedText style={{ fontWeight: "600" }}>
                {anime.startDate.year}-
                {String(anime.startDate.month || 0).padStart(2, "0")}-
                {String(anime.startDate.day || 0).padStart(2, "0")}
              </ThemedText>
            </View>
          )}

          {anime.genres && anime.genres.length > 0 && (
            <View style={{ gap: 4 }}>
              <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                Genres
              </ThemedText>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {anime.genres.map((genre: string, index: number) => (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      backgroundColor: placeholderBg,
                      borderRadius: 6,
                    }}
                  >
                    <ThemedText style={{ fontSize: 12 }}>{genre}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {anime.studios?.nodes && anime.studios.nodes.length > 0 && (
            <View style={{ gap: 4 }}>
              <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                Studios
              </ThemedText>
              <ThemedText style={{ fontWeight: "600" }}>
                {anime.studios.nodes.map((s: any) => s.name).join(", ")}
              </ThemedText>
            </View>
          )}
        </View>

        <ButtonComponent title="Back" onPress={() => router.back()} />
      </ScrollView>
    </ParallaxScrollView>
  );
};

export default AnimeDetailsScreen;
