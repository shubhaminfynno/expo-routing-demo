import ButtonComponent from "@/components/Button";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import {
  useCreateGraphqlZeroPost,
  useDeleteGraphqlZeroPost,
  useGraphqlZeroPosts,
} from "@/hooks/queryHooks";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GraphqlZeroScreen = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const router = useRouter();
  const borderColor = useThemeColor({}, "border");
  const placeholderColor = useThemeColor(
    { light: "#999", dark: "#888" },
    "text"
  );
  const bgColor = useThemeColor({}, "background");

  const {
    data: postsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGraphqlZeroPosts(1, 10);

  const { mutateAsync: createPost, isPending } = useCreateGraphqlZeroPost();
  const { mutateAsync: deletePost, isPending: isDeleting } =
    useDeleteGraphqlZeroPost();

  const localPosts = useMemo(() => postsData?.localPosts ?? [], [postsData]);
  const apiPosts = useMemo(() => postsData?.apiPosts ?? [], [postsData]);
  const allPosts = useMemo(() => postsData?.list ?? [], [postsData]);

  const handleCreate = async () => {
    if (!title.trim() || !body.trim()) {
      return;
    }

    await createPost({
      title: title.trim(),
      body: body.trim(),
    });

    setTitle("");
    setBody("");
  };

  const handleDelete = async (id: string | number) => {
    await deletePost(id);
  };

  const handlePostPress = (post: any) => {
    router.push({
      pathname: "/postDetails" as any,
      params: {
        id: String(post.id),
        title: post.title,
        body: post.body,
        isLocal: String(post.id).startsWith("local_") ? "true" : "false",
      },
    });
  };

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
      <ScrollView contentContainerStyle={{ paddingBottom: 60, gap: 16 }}>
        <View style={{ marginTop: 24, gap: 6 }}>
          <ThemedText type="title">GraphQLZero Demo</ThemedText>
          <ThemedText style={{ opacity: 0.8 }}>
            Query posts and create a new post against the public GraphQLZero
            API.
          </ThemedText>
        </View>

        <View style={{ gap: 10 }}>
          <ThemedText type="subtitle">Create Post (Mutation)</ThemedText>

          <TextInput
            placeholder="Title"
            placeholderTextColor={placeholderColor}
            value={title}
            onChangeText={setTitle}
            style={{
              borderWidth: 1,
              borderColor,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: bgColor,
            }}
          />

          <TextInput
            placeholder="Body"
            placeholderTextColor={placeholderColor}
            value={body}
            onChangeText={setBody}
            multiline
            style={{
              borderWidth: 1,
              borderColor,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              minHeight: 80,
              backgroundColor: bgColor,
              textAlignVertical: "top",
            }}
          />

          <ButtonComponent
            title={isPending ? "Creating..." : "Create Post"}
            onPress={handleCreate}
            disabled={isPending}
          />
        </View>

        {localPosts.length > 0 && (
          <View style={{ gap: 10 }}>
            <ThemedText type="subtitle">Created Posts</ThemedText>
            {localPosts.map((post: any) => (
              <TouchableOpacity
                key={post.id}
                onPress={() => handlePostPress(post)}
                style={{
                  borderWidth: 1,
                  borderColor,
                  borderRadius: 12,
                  padding: 12,
                  gap: 6,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontWeight: "700" }}>
                      {post.title}
                    </ThemedText>
                    <ThemedText style={{ opacity: 0.8 }} numberOfLines={2}>
                      {post.body}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                      {String(post.id).startsWith("local_")
                        ? "Local Post"
                        : "Created Post"}
                    </ThemedText>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(post.id)}
                    disabled={isDeleting}
                    style={{
                      padding: 8,
                      backgroundColor: "red",
                      borderRadius: 6,
                      marginLeft: 8,
                    }}
                  >
                    <ThemedText style={{ color: "white", fontSize: 12 }}>
                      Delete
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ThemedText type="subtitle">Posts (Query)</ThemedText>
            {isFetching && <ActivityIndicator size="small" />}
          </View>

          {isLoading && (
            <View style={{ marginTop: 12, alignItems: "center" }}>
              <ActivityIndicator size="large" />
            </View>
          )}

          {error && (
            <ThemedText style={{ color: "red" }}>
              Failed to load posts. Pull to retry.
            </ThemedText>
          )}

          {!isLoading &&
            apiPosts.map((post: any) => (
              <TouchableOpacity
                key={post.id}
                onPress={() => handlePostPress(post)}
                style={{
                  borderWidth: 1,
                  borderColor,
                  borderRadius: 12,
                  padding: 12,
                  gap: 6,
                }}
              >
                <ThemedText style={{ fontWeight: "700" }}>
                  {post.title}
                </ThemedText>
                <ThemedText style={{ opacity: 0.8 }} numberOfLines={2}>
                  {post.body}
                </ThemedText>
                {post.user?.name ? (
                  <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
                    Author: {post.user.name}
                  </ThemedText>
                ) : null}
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </ParallaxScrollView>
  );
};

export default GraphqlZeroScreen;
