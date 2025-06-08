// app/selectPlaylist.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getUserPlaylistAPI, addSongToPlaylistAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import Toast from "react-native-toast-message";

const SelectPlaylistScreen = () => {
  const { songId } = useLocalSearchParams();
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        setLoading(true);
        const userPlaylists = await getUserPlaylistAPI();
        setPlaylists(userPlaylists);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not load your playlists.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserPlaylists();
  }, []);

  const handleSelectPlaylist = async (playlistId: string) => {
    // LOG 1: Kiểm tra các ID trước khi gọi API
    console.log(`[BẮT ĐẦU] Thêm bài hát ID: ${songId} vào playlist ID: ${playlistId}`);

    if (!songId || adding) {
      console.log("[DỪNG] Thiếu songId hoặc đang trong quá trình thêm.");
      return;
    }

    setAdding(true);
    try {
      console.log("[GỌI API] Đang gọi addSongToPlaylistAPI...");
      const result = await addSongToPlaylistAPI(playlistId, songId as string);

      // LOG 2: In ra kết quả khi thành công
      console.log("[THÀNH CÔNG] API trả về:", JSON.stringify(result.data, null, 2));

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Song added to the playlist!",
      });
      router.back(); // Quay lại màn hình trước đó
    } catch (error: any) {
      // LOG 3: In ra lỗi chi tiết khi thất bại
      console.error("!!!!!!!!!! LỖI KHI THÊM BÀI HÁT !!!!!!!!!!");
      if (error.response) {
        console.error("Lỗi Status:", error.response.status);
        console.error("Lỗi Data:", JSON.stringify(error.response.data, null, 2));
      } else {
        console.error("Lỗi Message:", error.message);
      }
      console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

      const message = error.response?.data?.message || "Failed to add the song.";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
      });
    } finally {
      console.log("[KẾT THÚC] Quá trình thêm bài hát hoàn tất.");
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
        style={styles.containerCenter}
      >
        <ActivityIndicator size="large" color={APP_COLOR.WHITE} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={APP_COLOR.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a Playlist</Text> 
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.playlistItem}
            onPress={() => handleSelectPlaylist(item.id)}
            disabled={adding}
          >
            <Ionicons name="musical-notes" size={24} color={APP_COLOR.PINK} />
            <Text style={styles.playlistTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.containerCenter}>
            <Text style={styles.emptyText}>You don't have any playlists yet.</Text>
          </View>
        }
      />
      {adding && (
        <View style={styles.addingOverlay}>
            <ActivityIndicator size="large" color={APP_COLOR.PINK} />
            <Text style={{color: 'white', marginTop: 10}}>Adding...</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  backButton: {
    padding: 5,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
  },
  playlistTitle: {
    color: "white",
    fontSize: 18,
    marginLeft: 15,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  addingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SelectPlaylistScreen;