import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import {
  createPlaylistAPI,
  getAccountAPI,
  getPlaylistsAPI,
  updatePlaylistAPI,
  deletePlaylistAPI,
  getUserPlaylistAPI,
} from "@/utils/api";
import VideoMoreMenu from "@/components/videoMoreMenu";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
interface Playlist {
  id: string;
  name: string;
  count: number;
  isPublic: boolean;
  imageUrl?: string;
}

const PlaylistScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null
  );
  const [playlistImage, setPlaylistImage] = useState<string | null>(null);

  const fetchUserAndPlaylists = async () => {
    try {
      const userRes = await getAccountAPI();
      setUserId(userRes.userId || null);

      const res = await getUserPlaylistAPI();
      console.log(res);
      if (res) {
        const fetched = res.map((p: any) => ({
          id: p.id,
          name: p.title,
          count: p.songs?.length || 0,
          isPublic: p.isPublic,
          imageUrl: p.imageUrl,
        }));
        setPlaylists(fetched);
      }
    } catch (err) {
      // console.error("Init failed:", err);
    }
  };

  useEffect(() => {
    fetchUserAndPlaylists();
  }, [playlistImage, userId]);

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim() || !userId) return;

    const isDuplicate = playlists.some(
      (p) => p.name.toLowerCase().trim() === playlistName.toLowerCase().trim()
    );
    if (isDuplicate) {
      Alert.alert("Playlist đã tồn tại!");
      return;
    }

    try {
      await createPlaylistAPI({ title: playlistName, userId });
      setPlaylistName("");
      setModalVisible(false);
      fetchUserAndPlaylists();
    } catch (error: any) {
      if (error.response?.status === 409) {
        Alert.alert("Tên playlist đã tồn tại!");
      } else {
        // console.error("Failed to create playlist:", error);
      }
    }
  };

  const handleTogglePublic = async (
    playlistId: string,
    currentStatus: boolean
  ) => {
    try {
      await updatePlaylistAPI(playlistId, { isPublic: !currentStatus });
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId ? { ...p, isPublic: !p.isPublic } : p
        )
      );
    } catch (err) {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái công khai");
    }
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && selectedPlaylistId) {
      const imageUri = result.assets[0].uri;
      setPlaylistImage(imageUri);

      const fileName = imageUri.split("/").pop() || "playlist.jpg";
      const match = /\.(\w+)$/.exec(fileName);
      const fileType = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: fileName,
        type: fileType,
      } as any);

      try {
        await updatePlaylistAPI(selectedPlaylistId, formData);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Upload image successful!",
        });

        fetchUserAndPlaylists();
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Cannot upload image",
        });
      }
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    Alert.alert("Xoá Playlist", "Bạn có chắc muốn xoá playlist này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePlaylistAPI(playlistId);
            setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
            setSelectedPlaylistId(null);
          } catch (error) {
            // console.error("Xoá playlist lỗi:", error);
            Alert.alert("Lỗi", "Không thể xoá playlist");
          }
        },
      },
    ]);
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
              <TouchableOpacity
                onPress={() =>
                  router.push(`/(user)/playlistSong?id=${item.id}`)
                }
              >
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="w-16 h-16 rounded-lg mr-4"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4" />
                )}
              </TouchableOpacity>

              <View className="flex-1">
                <Text className="text-white font-bold">{item.name}</Text>
                <Text className="text-gray-400">
                  Sum of Songs: {item.count}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedPlaylistId(item.id)}
                className="ml-2"
              >
                <Ionicons name="ellipsis-vertical" size={20} color="white" />
              </TouchableOpacity>
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

      {selectedPlaylistId && (
        <VideoMoreMenu
          visible={!!selectedPlaylistId}
          onClose={() => setSelectedPlaylistId(null)}
          actions={[
            {
              label: playlists.find((p) => p.id === selectedPlaylistId)
                ?.isPublic
                ? "Make Private"
                : "Make Public",
              onPress: () => {
                const playlist = playlists.find(
                  (p) => p.id === selectedPlaylistId
                );
                if (playlist) {
                  handleTogglePublic(playlist.id, playlist.isPublic);
                }
              },
            },
            {
              label: "Upload Image",
              onPress: () => {
                pickImage();
              },
            },
            {
              label: "Delete Playlist",
              onPress: () => handleDeletePlaylist(selectedPlaylistId!),
            },
          ]}
        />
      )}
    </LinearGradient>
  );
};

export default PlaylistScreen;
