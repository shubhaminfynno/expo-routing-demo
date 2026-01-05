import type { MMKV } from "react-native-mmkv";
import { createMMKV } from "react-native-mmkv";

let mmkv: MMKV | null = null;
const memoryStore = new Map<string, string>();

try {
  mmkv = createMMKV({ id: "app-storage" });
} catch (error) {
  console.log("MMKV init failed, using in-memory fallback", error);
}

export const getJson = <T>(
  key: string,
  fallback: T | null = null
): T | null => {
  try {
    const value = mmkv ? mmkv.getString(key) : memoryStore.get(key);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch (error) {
    console.log("MMKV read error", error);
    return fallback;
  }
};

export const setJson = (key: string, value: unknown) => {
  try {
    const serialized = JSON.stringify(value);
    if (mmkv) {
      mmkv.set(key, serialized);
    } else {
      memoryStore.set(key, serialized);
    }
  } catch (error) {
    console.log("MMKV write error", error);
  }
};
