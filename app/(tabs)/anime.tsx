import { graphQLClientAnimes } from "@/api/graphQlClient";
import ButtonComponent from "@/components/Button";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { LIKE_ANIME } from "@/graphQl/getAnimes";
import { getItemFromStorage, setItemInStorage } from "@/helper";
import { useAnimes } from "@/hooks/queryHooks/useAnimes";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Anime } from "@/types";
import { LegendList } from "@legendapp/list";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";

const STORAGE_KEY = "likedAnimes";

export const ANIME_HEADER_IMAGE = (
  <Image
    source={require("@/assets/images/anime.png")}
    style={{
      height: 178,
      width: 220,
      bottom: 0,
      position: "absolute",
    }}
  />
);

type ListItem =
  | { type: "header"; title: string }
  | { type: "anime"; anime: Anime };

const AnimeScreen = () => {
  const router = useRouter();
  const { data, isLoading, error } = useAnimes();
  const [likingId, setLikingId] = useState<number | null>(null);
  const [likedAnimes, setLikedAnimes] = useState<Anime[]>([]);
  const borderColor = useThemeColor({}, "border");
  const placeholderBg = useThemeColor(
    { light: "rgba(0,0,0,0.05)", dark: "rgba(255,255,255,0.06)" },
    "background"
  );

  // Load liked animes from storage on mount
  useEffect(() => {
    const loadLikedAnimes = async () => {
      const stored = await getItemFromStorage(STORAGE_KEY);
      if (stored) {
        setLikedAnimes(stored);
      }
    };
    loadLikedAnimes();
  }, []);

  const animes: Anime[] = useMemo(() => {
    if (!data) return [];
    return (data as Anime[]) ?? [];
  }, [data]);

  const likedAnimeIds = useMemo(() => {
    return new Set(likedAnimes.map((a) => a.id));
  }, [likedAnimes]);

  const handleLike = async (anime: Anime) => {
    const isLiked = likedAnimeIds.has(anime.id);
    setLikingId(anime.id);

    try {
      await graphQLClientAnimes.request(LIKE_ANIME, { mediaId: anime.id });
    } catch (e) {
      console.log("LikeAnime mutation failed (likely missing auth token)", e);
    }

    // Update local storage regardless of API success
    let updatedLikedAnimes: Anime[];
    if (isLiked) {
      updatedLikedAnimes = likedAnimes.filter((a) => a.id !== anime.id);
    } else {
      updatedLikedAnimes = [anime, ...likedAnimes];
    }

    setLikedAnimes(updatedLikedAnimes);
    await setItemInStorage(STORAGE_KEY, updatedLikedAnimes);
    setLikingId(null);
  };

  const handleAnimePress = (anime: Anime) => {
    router.push({
      pathname: "/animeDetails" as any,
      params: {
        id: String(anime.id),
        title:
          anime.title.english || anime.title.romaji || `Anime #${anime.id}`,
      },
    });
  };

  const legendData: ListItem[] = useMemo(() => {
    const items: ListItem[] = [];

    if (likedAnimes.length > 0) {
      items.push({ type: "header", title: "Liked Animes" });
      likedAnimes.forEach((anime) => items.push({ type: "anime", anime }));
    }

    items.push({ type: "header", title: "Top Animes" });
    animes.forEach((anime) => items.push({ type: "anime", anime }));

    return items;
  }, [likedAnimes, animes]);

  if (isLoading) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={ANIME_HEADER_IMAGE}
      >
        <View style={{ marginTop: 60, alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </ParallaxScrollView>
    );
  }

  if (error) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={ANIME_HEADER_IMAGE}
      >
        <View style={{ marginTop: 60, gap: 12 }}>
          <ThemedText type="title">Anime (AniList)</ThemedText>
          <ThemedText>
            Failed to load animes. Check console for details.
          </ThemedText>
        </View>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={ANIME_HEADER_IMAGE}
    >
      <View style={{ marginTop: 30, gap: 16 }}>
        <ThemedText type="title">Anime (AniList)</ThemedText>
      </View>

      <LegendList
        data={legendData}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        scrollEnabled={false}
        renderItem={({ item }) => {
          if (item.type === "header") {
            return (
              <View style={{ marginTop: 24, marginBottom: 12 }}>
                <ThemedText type="subtitle">{item.title}</ThemedText>
              </View>
            );
          }

          const anime = item.anime;
          const displayTitle =
            anime.title.english || anime.title.romaji || `Anime #${anime.id}`;
          const isLiked = likedAnimeIds.has(anime.id);

          return (
            <TouchableOpacity
              onPress={() => handleAnimePress(anime)}
              style={{
                flexDirection: "row",
                gap: 12,
                paddingVertical: 8,
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: borderColor,
              }}
            >
              {anime.coverImage?.medium ? (
                <Image
                  source={{ uri: anime.coverImage.medium }}
                  style={{ width: 56, height: 80, borderRadius: 8 }}
                />
              ) : (
                <View
                  style={{
                    width: 56,
                    height: 80,
                    borderRadius: 8,
                    backgroundColor: placeholderBg,
                  }}
                />
              )}

              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontWeight: "600" }}>
                  {displayTitle}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>
                  AniList ID: {anime.id}
                </ThemedText>
              </View>

              <ButtonComponent
                title={isLiked ? "Liked" : "Like"}
                onPress={() => handleLike(anime)}
                isLoading={likingId === anime.id}
                disabled={likingId === anime.id}
                variant={isLiked ? "secondary" : "primary"}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          isLoading ? (
            <View style={{ marginTop: 60, alignItems: "center" }}>
              <ActivityIndicator size="large" />
            </View>
          ) : null
        }
      />
    </ParallaxScrollView>
  );
};

export default AnimeScreen;
