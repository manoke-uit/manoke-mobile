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
import { getKaraokesBySongId } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";

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
  const { id } = useLocalSearchParams(); // songId
  const [karaokes, setKaraokes] = useState<IKaraoke[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKaraokes = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getKaraokesBySongId(id as string);
      const publicKara = res.data.filter(
        (item: IKaraoke) => item.status === "public"
      );

      setKaraokes(publicKara || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load karaokes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaraokes();
  }, [id]);

  const handleSelect = (karaokeId: string) => {
    router.push(`/songItem?id=${id}&karaokeId=${karaokeId}`);
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

  if (!loading && karaokes.length === 0) {
    return (
      <LinearGradient
        colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
        style={styles.containerCenter}
      >
        <Ionicons
          name="mic-off-outline"
          size={64}
          color="rgba(255, 255, 255, 0.5)"
        />
        <Text style={styles.emptyText}>No karaokes found for this song.</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => router.push("/addSong")}
        >
          <Text style={styles.uploadButtonText}>Be the first to upload!</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Choose a Karaoke</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={karaokes}
        renderItem={({ item }) => (
          <KaraokeCard item={item} onSelect={handleSelect} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      />
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
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  backButton: {
    padding: 5,
  },
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
