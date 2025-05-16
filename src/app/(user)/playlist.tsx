import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import { createPlaylistAPI, getAccountAPI, getPlaylistsAPI } from "@/utils/api";

interface Playlist {
  id: string;
  name: string;
  count: number;
}

const PlaylistScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndPlaylists = async () => {
      try {
        const userRes = await getAccountAPI();
        setUserId(userRes.userId || null);

        const playlistRes = await getPlaylistsAPI();
        const fetched =
          playlistRes.items.map((p) => ({
            id: p.title,
            name: p.title,
            count: p.songIds?.length || 0,
          })) || [];

        setPlaylists(fetched);
      } catch (err) {
        console.error("Init failed:", err);
      }
    };

    fetchUserAndPlaylists();
  }, []);

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim() || !userId) return;

    try {
      const payload = {
        title: playlistName,
        userId,
        imageUrl:
          "https://th.bing.com/th/id/OIP.uehPD8NZotJntHCtC3-V9wHaE8?rs=1&pid=ImgDetMain",
        description: "ahihi",
        songIds: ["0c36ab27-182c-45dc-8736-c254712f5497"],
      };

      await createPlaylistAPI(payload);

      const playlistRes = await getPlaylistsAPI();
      const updated =
        playlistRes.items.map((p) => ({
          id: p.title,
          name: p.title,
          count: p.songIds?.length || 0,
        })) || [];

      setPlaylists(updated);
      setPlaylistName("");
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to create playlist:", error);
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
          <View className="w-48 h-48 bg-gray-400" />
        </View>

        <View className="flex-row justify-between items-center px-4 mb-10">
          <Text className="text-white text-2xl font-bold">All Playlists</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-pink-500 rounded-lg px-6 py-2"
          >
            <Text className="text-white font-semibold">Add</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4">
          {playlists.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center mb-5 border-b border-white/10 pb-4"
            >
              <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4" />
              <View className="flex-1">
                <Text className="text-white font-bold">{item.name}</Text>
                <Text className="text-gray-400">
                  Sum of Songs: {item.count}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={{
              width: "80%",
              backgroundColor: "#1E1E1E",
              borderRadius: 20,
              padding: 20,
            }}
            onPress={() => {}}
          >
            <Text className="text-white text-xl font-bold mb-4 text-center">
              Create New Playlist
            </Text>

            <TextInput
              placeholder="Enter playlist name"
              placeholderTextColor="#aaa"
              className="bg-white/10 text-white p-3 rounded-lg mb-6"
              value={playlistName}
              onChangeText={setPlaylistName}
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-500 rounded-lg px-6 py-2"
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreatePlaylist}
                className="bg-pink-600 rounded-lg px-6 py-2"
              >
                <Text className="text-white font-semibold">Create</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

export default PlaylistScreen;