import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
// Import thêm getSongById và MaterialIcons
import { getKaraokesBySongId, getSongById } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // << Thêm MaterialIcons

// KaraokeCard được đơn giản hóa, không còn nút "..."
const KaraokeCard = ({
  item,
  onSelect,
}: {
  item: IKaraoke;
  onSelect: (id: string) => void;
}) => {
  const placeholderImage =
    "https://via.placeholder.com/80x80.png?text=No+Image";

  return (
    <TouchableOpacity onPress={() => onSelect(item.id)} style={styles.card}>
      <Image
        source={{ uri: item.song.imageUrl || placeholderImage }}
        style={styles.songImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {/* Tiêu đề bài hát đã có trong item.song.title */}
          {item.song.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description || "Karaoke version"}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {item.song.artists?.map((a) => a.name).join(", ") || "Unknown Artist"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};


const ChooseKaraokes = () => {
  const { id: songId } = useLocalSearchParams();
  const [karaokes, setKaraokes] = useState<IKaraoke[]>([]);
  const [song, setSong] = useState<ISong | null>(null); // << State để lưu thông tin bài hát
  const [loading, setLoading] = useState(true);

  // Không cần state cho MoreMenu nữa

  useEffect(() => {
    const fetchData = async () => {
      if (!songId) return;
      try {
        setLoading(true);
        // Gọi cả 2 API để lấy thông tin bài hát và danh sách karaoke
        const [songDetails, karaokeRes] = await Promise.all([
            getSongById(songId as string),
            getKaraokesBySongId(songId as string),
        ]);
        
        setSong(songDetails); // Lưu thông tin bài hát

        const publicKara = karaokeRes.data.filter(
          (item: IKaraoke) => item.status === "public"
        );
        setKaraokes(publicKara || []);

      } catch (error) {
        console.error("Failed to load data:", error);
        Alert.alert("Error", "Failed to load data for this song");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [songId]);

  const handleSelectKaraoke = (karaokeId: string) => {
    router.push(`/songItem?id=${songId}&karaokeId=${karaokeId}`);
  };

  // Hàm mới để thêm bài hát vào playlist
  const handleAddSongToPlaylist = () => {
    if (!songId) return;
    router.push(`/selectPlaylist?songId=${songId}`);
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={APP_COLOR.WHITE} />
        </TouchableOpacity>
        
        {/* Hiển thị tên bài hát trên header */}
        <Text style={styles.headerTitle} numberOfLines={1}>
            {song?.title || "Choose a Karaoke"}
        </Text>

        {/* Nút Add to Playlist mới */}
        <TouchableOpacity
          onPress={handleAddSongToPlaylist}
          style={styles.headerButton}
        >
          <MaterialIcons name="playlist-add" size={28} color={APP_COLOR.WHITE} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={karaokes}
        renderItem={({ item }) => (
          <KaraokeCard
            item={item}
            onSelect={handleSelectKaraoke}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
                <Ionicons
                    name="mic-off-outline"
                    size={64}
                    color="rgba(255, 255, 255, 0.5)"
                />
                <Text style={styles.emptyText}>No karaokes found for this song.</Text>
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => router.push(`/addKaraoke?songId=${songId}`)}
                >
                    <Text style={styles.uploadButtonText}>Be the first to upload!</Text>
                </TouchableOpacity>
            </View>
        )}
        contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }} // flexGrow để ListEmptyComponent căn giữa
        showsVerticalScrollIndicator={false}
      />
      {/* Không cần MoreMenu ở đây nữa */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1, // Để tiêu đề co giãn
    textAlign: 'center', // Căn giữa
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  backButton: {
    padding: 5,
  },
  headerButton: { // Style cho nút mới
    padding: 5,
  },
  // Card không còn container riêng
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    overflow: "hidden",
    padding: 12,
  },
  songImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  songTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    marginBottom: 6,
  },
  artistName: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
  },
  emptyContainer: { // Style cho màn hình rỗng
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
  uploadButton: {
    marginTop: 24,
    backgroundColor: APP_COLOR.PINK,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChooseKaraokes;