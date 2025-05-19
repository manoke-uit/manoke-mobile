import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import MoreMenu from "@/components/moreMenu";
import { router, useLocalSearchParams } from "expo-router";
import { getPlaylistById } from "@/utils/api";

const PlaylistSong = () => {
  const { id } = useLocalSearchParams();
  const [isMoreMenuVisible, setMoreMenuVisible] = useState<boolean>(false);
  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [playlistImage, setPlaylistImage] = useState<string>("");
  const [songs, setSongs] = useState<
    {
      id: string;
      title: string;
      imageUrl?: string;
      artists: { name: string }[];
    }[]
  >([]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const data = await getPlaylistById(id as string);
        setPlaylistTitle(data.title);
        setPlaylistImage(data.imageUrl);
        setSongs(data.songs || []);
      } catch (err) {
        Alert.alert("Lỗi", "Không thể tải playlist");
      }
    };

    if (id) fetchPlaylist();
  }, [id]);

  const handleAddToQueue = () => {
    console.log("Added to queue");
  };

  const handleAddToFavorite = () => {
    console.log("Added to favorite");
  };

  const handleRemoveFromPlaylist = () => {
    console.log("Removed from playlist");
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
          {playlistTitle || "Đang tải..."}
        </Text>

        <View className="flex-row justify-start mb-10 ml-4">
          <TouchableOpacity
            onPress={() => console.log("Add songs pressed")}
            className="bg-pink-500 rounded-lg px-6 py-2 mr-4"
          >
            <Text className="text-white font-semibold"> Add </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log("Delete playlist pressed")}
            className="bg-gray-500 rounded-lg px-6 py-2"
          >
            <Text className="text-white font-semibold">Delete Playlist</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4">
          {songs.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center mb-5 border-b border-white/10 pb-4"
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    marginRight: 16,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4" />
              )}
              <View className="flex-1">
                <Text className="text-white font-bold">{item.title}</Text>
                <Text className="text-gray-400 text-sm">
                  {item.artists?.map((a) => a.name).join(", ") || "Unknown"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setMoreMenuVisible(true)}
                className="ml-2"
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={APP_COLOR.WHITE}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <MoreMenu
        visible={isMoreMenuVisible}
        onClose={() => setMoreMenuVisible(false)}
        onAddToQueue={handleAddToQueue}
        onRemoveFromQueue={() => {}}
        onAddToFavorite={handleAddToFavorite}
        onRemoveFromFavorite={() => {}}
        onAddToPlaylist={() => {}}
        onRemoveFromPlaylist={handleRemoveFromPlaylist}
        isFavoriteTab={false}
        isQueueTab={false}
        isPlaylistTab={true}
      />
    </LinearGradient>
  );
};

export default PlaylistSong;
