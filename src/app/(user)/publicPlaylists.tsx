import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  // Thêm GestureResponderEvent để xử lý kiểu cho event
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import MoreMenu from "@/components/moreMenu"; // << 1. Import MoreMenu
import { router, useLocalSearchParams } from "expo-router";
import {
  getPlaylistById,
  clonePlaylistAPI,
  getAccountAPI,
  getPlaylistsAPI,
} from "@/utils/api";
import Toast from "react-native-toast-message";

// Giả định bạn có kiểu ISong được định nghĩa ở đâu đó
interface ISong {
  id: string;
  title: string;
  imageUrl?: string;
  artists: { name: string }[];
}

const PlaylistSong = () => {
  const { id } = useLocalSearchParams();
  const [isMoreMenuVisible, setMoreMenuVisible] = useState<boolean>(false);
  
  // --- 2. Thêm State để quản lý bài hát được chọn ---
  const [selectedSong, setSelectedSong] = useState<ISong | null>(null);

  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [playlistImage, setPlaylistImage] = useState<string>("");
  const [playlistDescription, setPlaylistDescription] = useState<string>("");
  const [songs, setSongs] = useState<ISong[]>([]);

  const [userId, setUserId] = useState<string | null>(null);
  const [myPlaylists, setMyPlaylists] = useState<IPlaylist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const acc = await getAccountAPI();
        setUserId(acc.userId);
        const allPlaylists = await getPlaylistsAPI();
        const userPlaylists = allPlaylists.filter(
          (p: any) => p.user?.id === acc.userId
        );
        setMyPlaylists(userPlaylists);

        const data = await getPlaylistById(id as string);
        setPlaylistTitle(data.title);
        setPlaylistImage(data.imageUrl);
        setPlaylistDescription(data.description || "");
        setSongs(data.songs || []);
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Could not load the necessary data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleClonePlaylist = async () => {
    if (!id) {
      Toast.show({ type: "error", text1: "Error", text2: "Playlist ID not found." });
      return;
    }
     if (!userId) {
      Toast.show({ type: "error", text1: "Error", text2: "User not found. Cannot clone." });
      return;
    }

    try {
      await clonePlaylistAPI(id as string);
      Toast.show({ type: "success", text1: "Success", text2: "The playlist has been cloned to your account." });

      const allPlaylists = await getPlaylistsAPI();
      const userPlaylists = allPlaylists.filter(
        (p: any) => p.user?.id === userId
      );
      setMyPlaylists(userPlaylists);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Could not clone the playlist.";
      Toast.show({ type: "error", text1: "Error", text2: errorMessage });
    }
  };

  // --- 3. Cập nhật các hàm xử lý cho Menu ---
  const handleMoreOptions = (song: ISong, e: GestureResponderEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click vào cả hàng
    setSelectedSong(song);
    setMoreMenuVisible(true);
  };
  
  const handleCloseMenu = () => {
    setMoreMenuVisible(false);
    setSelectedSong(null);
  };

  const handleAddToPlaylist = () => {
    if (!selectedSong) return;
    // Điều hướng đến trang chọn playlist và mang theo songId
    router.push(`/selectPlaylist?songId=${selectedSong.id}`);
    handleCloseMenu();
  };


  const handleNavigateToKaraoke = (songId: string) => {
    router.push(`/chooseKaraokes?id=${songId}`);
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.4]}
      style={{ flex: 1 }}
    >
      <View
        className="w-full flex flex-row justify-between items-center"
        style={{ paddingVertical: 30, paddingHorizontal: 20 }}
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
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        className="flex-1"
      >
        <View className="items-center mb-6">
          {playlistImage ? (
            <Image
              source={{ uri: playlistImage }}
              className="w-48 h-48 rounded-xl"
            />
          ) : (
            <View className="w-48 h-48 bg-gray-400 rounded-xl" />
          )}
        </View>

        <Text className="text-white text-2xl font-bold mb-6 ml-4">
          {loading ? "Loading..." : playlistTitle}
        </Text>

        <View className="flex-row justify-start mb-10 ml-4">
          <TouchableOpacity
            onPress={handleClonePlaylist}
            className="bg-pink-500 rounded-lg px-6 py-2 mr-4"
          >
            <Text className="text-white font-semibold">Clone</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4">
          {songs.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center mb-5 border-b border-white/10 pb-4"
              onPress={() => handleNavigateToKaraoke(item.id)}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: 64, height: 64, borderRadius: 8, marginRight: 16,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4" />
              )}
              <View className="flex-1">
                <Text className="text-white font-bold">{item.title}</Text>
              </View>
              <TouchableOpacity
                onPress={(e) => handleMoreOptions(item, e)}
                className="ml-2 p-2"
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={APP_COLOR.WHITE}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {selectedSong && (
        <MoreMenu
          visible={isMoreMenuVisible}
          onClose={handleCloseMenu}
          onAddToPlaylist={handleAddToPlaylist}
        />
      )}

    </LinearGradient>
  );
};

export default PlaylistSong;