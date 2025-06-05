import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { getAllSongs } from "@/utils/api";
import { router } from "expo-router";

const PublicSongs = () => {
  const [songs, setSongs] = useState<ISong[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await getAllSongs();
      setSongs(res?.data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.4]}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 50 }}>
        <Text className="text-white text-2xl font-bold mb-4">All Songs</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : songs.length === 0 ? (
          <Text className="text-white text-lg">No songs available</Text>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {songs.map((s) => (
              <TouchableOpacity
                key={s.id}
                className="flex-row items-center mb-5 border-b border-white/10 pb-4"
                onPress={() => router.push(`/songItem?id=${s.id}`)}
              >
                <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4">
                  {s.imageUrl && (
                    <Image
                      source={{ uri: s.imageUrl }}
                      className="w-full h-full rounded-lg"
                    />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-base">
                    {s.title}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {s.artists?.map((a) => a.name).join(", ") ||
                      "Unknown Artist"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </LinearGradient>
  );
};

export default PublicSongs;
