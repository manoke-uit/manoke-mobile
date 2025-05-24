import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import {
  getPlaylistsAPI,
  getAccountAPI,
  getPlaylistById,
  createPlaylistAPI,
} from "@/utils/api";

const PublicPlaylists = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [myPlaylists, setMyPlaylists] = useState<IPlaylist[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const acc = await getAccountAPI();
      setUserId(acc.userId);

      const all = await getPlaylistsAPI();
      const publicPlaylists = all.filter((p: any) => p.isPublic);
      const mine = all.filter((p: any) => p.user?.id === acc.userId);

      setPlaylists(publicPlaylists);
      setMyPlaylists(mine);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách playlist");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClonePlaylist = async (playlistId: string) => {
    try {
      if (!userId) {
        Alert.alert("Lỗi", "Không xác định được người dùng.");
        return;
      }

      const data = await getPlaylistById(playlistId);
      const clonedTitle = `${data.title} (Cloned)`;

      const alreadyExists = myPlaylists.some((p) => p.title === clonedTitle);

      if (alreadyExists) {
        Alert.alert("Thông báo", "Bạn đã clone playlist này rồi.");
        return;
      }

      const songIds = data.songs?.map((s: any) => s.id) || [];

      await createPlaylistAPI({
        title: clonedTitle,
        imageUrl: data.imageUrl,
        description: data.description,
        userId,
        songIds,
      });

      Alert.alert("Thành công", "Playlist đã được clone về tài khoản của bạn.");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể clone playlist");
      console.error(error);
    }
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.4]}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          className="w-full flex-row items-center"
          style={{
            paddingVertical: 30,
            paddingHorizontal: 20,
            backgroundColor: "transparent",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-pink-500/30"
          >
            <Ionicons
              name="chevron-back-outline"
              size={25}
              color={APP_COLOR.WHITE}
            />
          </TouchableOpacity>

          <View className="flex-1 items-center">
            <Text className="text-white text-2xl font-bold">
              Public Playlists
            </Text>
          </View>

          <View className="w-10" />
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 80,
          }}
          className="flex-1"
        >
          {loading ? (
            <View className="items-center mt-10">
              <Text className="text-white text-lg">Loading...</Text>
            </View>
          ) : playlists.length === 0 ? (
            <View className="items-center mt-10">
              <Text className="text-white text-lg font-semibold">
                Không có playlist nào được public
              </Text>
            </View>
          ) : (
            <View className="px-4">
              {playlists.map((p) => (
                <View
                  key={p.id}
                  className="flex-row items-center mb-5 border-b border-white/10 pb-4"
                >
                  {p.imageUrl ? (
                    <Image
                      source={{ uri: p.imageUrl }}
                      className="w-16 h-16 rounded-lg mr-4"
                    />
                  ) : (
                    <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4" />
                  )}
                  <View className="flex-1">
                    <Text className="text-white font-bold">{p.title}</Text>
                    <Text className="text-gray-400 text-xs">
                      {p.description || "No description"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleClonePlaylist(p.id)}
                    className="ml-2 bg-pink-600 px-3 py-1 rounded-lg"
                  >
                    <Text className="text-white text-xs font-semibold">
                      Clone
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default PublicPlaylists;
