import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MoreMenu from "@/components/moreMenu";
import { WebView } from "react-native-webview";
import { searchYoutubeAPI } from "@/utils/api";

const song = [
  { id: "1", name: "Lạc Trôi", artist: "Sơn Tùng M-TP" },
  { id: "2", name: "Em Của Ngày Hôm Qua", artist: "Sơn Tùng M-TP" },
  { id: "3", name: "Có Chắc Yêu Là Đây", artist: "Sơn Tùng M-TP" },
  { id: "4", name: "Nơi Này Có Anh", artist: "Sơn Tùng M-TP" },
  { id: "5", name: "Muộn Rồi Mà Sao Còn", artist: "Sơn Tùng M-TP" },
  { id: "6", name: "Chúng Ta Của Hiện Tại", artist: "Sơn Tùng M-TP" },
  { id: "7", name: "Hãy Trao Cho Anh", artist: "Sơn Tùng M-TP" },
  { id: "8", name: "Chạy Ngay Đi", artist: "Sơn Tùng M-TP" },
];

const SongItemScreen = () => {
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const handlePlaySong = async (name: string, artist: string) => {
    try {
      const res = await searchYoutubeAPI(`${name} ${artist}`, "");
      const video = res.results.find((v) => v.isEmbedded !== false);
      if (video?.videoId) {
        setSelectedVideoId(video.videoId);
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể load video");
    }
  };

  useEffect(() => {
    handlePlaySong(song[0].name, song[0].artist);
  }, []);

  const handleRemoveFromQueue = () => {
    console.log("Removed from queue");
  };

  const handleAddToFavorite = () => {
    console.log("Added to favorite");
  };

  const handleAddToPlaylist = () => {
    console.log("Added to playlist");
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.BLACK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View
        className="w-full flex flex-row"
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

      <View style={{ flex: 1 }}>
        <View style={{ height: 250 }}>
          {selectedVideoId && (
            <WebView
              source={{
                uri: `https://www.youtube.com/embed/${selectedVideoId}`,
              }}
              onError={() => {
                Alert.alert(
                  "Không thể phát trong ứng dụng",
                  "Video này chỉ có thể xem trên YouTube",
                  [
                    {
                      text: "Mở YouTube",
                      onPress: () =>
                        Linking.openURL(
                          `https://www.youtube.com/watch?v=${selectedVideoId}`
                        ),
                    },
                    { text: "Huỷ", style: "cancel" },
                  ]
                );
                setSelectedVideoId(null);
              }}
              allowsFullscreenVideo
              style={{ flex: 1 }}
            />
          )}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View className="w-full px-5 py-4">
            <Text className="text-white font-bold text-2xl mb-2">
              Now Playing
            </Text>
            <View className="flex-row items-center mb-5">
              <View className="justify-center">
                <Text className="text-white font-bold text-xl">
                  {song[0].name}
                </Text>
                <Text className="text-gray-400 text-base">
                  {song[0].artist}
                </Text>
              </View>
              <TouchableOpacity
                className="ml-auto px-4 py-2"
                onPress={() => setMoreMenuVisible(true)}
              >
                <Entypo name="dots-three-vertical" size={20} color="#C0C0C0" />
              </TouchableOpacity>
            </View>

            <Text className="text-white font-bold text-2xl mb-3">Queue</Text>
            {song.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handlePlaySong(item.name, item.artist)}
                className="flex-row items-center mb-4"
              >
                <View className="w-20 h-20 bg-gray-400 rounded-lg mr-4" />
                <View className="justify-center">
                  <Text className="text-white font-semibold">{item.name}</Text>
                  <Text className="text-gray-400">{item.artist}</Text>
                </View>
                <TouchableOpacity
                  className="ml-auto px-4 py-2"
                  onPress={() => setMoreMenuVisible(true)}
                >
                  <Entypo
                    name="dots-three-vertical"
                    size={20}
                    color="#C0C0C0"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <MoreMenu
        visible={isMoreMenuVisible}
        onClose={() => setMoreMenuVisible(false)}
        onAddToQueue={() => {}}
        onRemoveFromQueue={handleRemoveFromQueue}
        onAddToFavorite={handleAddToFavorite}
        onRemoveFromFavorite={() => {}}
        onAddToPlaylist={handleAddToPlaylist}
        isFavoriteTab={false}
        isQueueTab={true}
      />
    </LinearGradient>
  );
};

export default SongItemScreen;
