import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import MoreMenu from "@/components/moreMenu";
import { router } from "expo-router";

const songs = [
  { id: "1", name: "Name of Song", artist: "Artist" },
  { id: "2", name: "Name of Song", artist: "Artist" },
  { id: "3", name: "Name of Song", artist: "Artist" },
  { id: "4", name: "Name of Song", artist: "Artist" },
];

const PlaylistSong = () => {
  const [isMoreMenuVisible, setMoreMenuVisible] = useState<boolean>(false);

  const handleAddToQueue = (): void => {
    console.log("Added to queue");
  };

  const handleAddToFavorite = (): void => {
    console.log("Added to favorite");
  };

  const handleRemoveFromPlaylist = (): void => {
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
      {/* Custom Header */}
      <View
        className="w-full flex flex-row justify-between items-center"
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
          <Ionicons name="chevron-back-outline" size={25} color={APP_COLOR.WHITE} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 80,
        }}
        className="flex-1"
      >
        <View className="items-center mb-6">
          <View className="w-48 h-48 bg-gray-400" /> 
        </View>

        <Text className="text-white text-2xl font-bold mb-6 ml-4">
          Name of Playlist
        </Text>

        <View className="flex-row justify-start mb-10 ml-4">
          <TouchableOpacity
            onPress={() => console.log("Add songs pressed")}
            className="bg-pink-500 rounded-lg px-6 py-2 mr-4"
          >
            <Text className="text-white font-semibold">    Add    </Text> 
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log("Delete playlist pressed")}
            className="bg-gray-500 rounded-lg px-6 py-2"
          >
            <Text className="text-white font-semibold">Delete Playlist</Text> 
          </TouchableOpacity>
        </View>

        {/* Danh sách bài hát */}
        <View className="px-4">
          {songs.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center mb-5 border-b border-white/10 pb-4"
            >
              <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4" />
              <View className="flex-1">
                <Text className="text-white font-bold">{item.name}</Text>
                <Text className="text-gray-400 text-sm">{item.artist}</Text>
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