import type { RandomUser } from "@/api/restClient";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePhotos } from "@/hooks/queryHooks";
import { useThemeColor } from "@/hooks/use-theme-color";
import { FlashList } from "@shopify/flash-list";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const ESTIMATED_ITEM_SIZE = 120;

interface PhotoItemProps {
  item: RandomUser;
}

const PhotoItem = React.memo<PhotoItemProps>(({ item }) => {
  const borderColor = useThemeColor({}, "border");
  const bgColor = useThemeColor({}, "background");

  return (
    <View
      style={[
        styles.itemContainer,
        {
          borderColor,
          backgroundColor: bgColor,
        },
      ]}
    >
      <Image
        source={{ uri: item.picture.large }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {`${item.name.first} ${item.name.last}`}
        </ThemedText>
        <ThemedText style={styles.description}>{item.email}</ThemedText>
      </View>
    </View>
  );
});

const FlashListScreen = () => {
  const {
    flattened: users,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePhotos();

  const borderColor = useThemeColor({}, "border");
  const bgColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncedUpdate = useMemo(
    () =>
      debounce((text: string) => {
        setDebouncedSearch(text.trim().toLowerCase());
      }, 300),
    []
  );

  useEffect(() => {
    debouncedUpdate(search);

    return () => {
      debouncedUpdate.cancel();
    };
  }, [search, debouncedUpdate]);

  const keyExtractor = useCallback(
    (item: RandomUser) => String(item.login.uuid),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: RandomUser }) => <PhotoItem item={item} />,
    []
  );

  const filteredUsers = useMemo(() => {
    if (!debouncedSearch) return users;
    return users.filter((u) => {
      const name = `${u.name.first} ${u.name.last}`.toLowerCase();
      return (
        name.includes(debouncedSearch) ||
        u.email.toLowerCase().includes(debouncedSearch)
      );
    });
  }, [debouncedSearch, users]);

  const handleEndReached = useCallback(() => {
    if (debouncedSearch) return;
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [debouncedSearch, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Loading photos...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>
            Failed to load photos. Please try again.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Users</ThemedText>
      </View>
      <View
        style={[
          styles.searchContainer,
          { borderColor, backgroundColor: bgColor },
        ]}
      >
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search title..."
          placeholderTextColor={textColor}
          style={styles.searchInput}
        />
      </View>
      <FlashList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        {...({ estimatedItemSize: ESTIMATED_ITEM_SIZE } as any)}
        contentContainerStyle={styles.listContent}
        onEndReached={debouncedSearch ? undefined : handleEndReached}
        onEndReachedThreshold={debouncedSearch ? 0 : 0.4}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator />
              <ThemedText style={styles.loadingText}>
                Loading more...
              </ThemedText>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        removeClippedSubviews
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    gap: 4,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 14,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  searchInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  loadingText: {
    marginTop: 8,
    opacity: 0.7,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "gray",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
  },
  description: {
    fontSize: 12,
    opacity: 0.6,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
});

export default FlashListScreen;
