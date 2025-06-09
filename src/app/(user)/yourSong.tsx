import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import VideoMoreMenu from "@/components/videoMoreMenu";
import { router, useFocusEffect } from "expo-router";
import {
  getAllOwnKaraokesAPI,
  requestPublicKaraokeAPI,
  deleteKaraokeAPI,
} from "@/utils/api";
import Toast from "react-native-toast-message";

// Interface IKaraoke
interface IKaraoke {
  id: string;
  description: string;
  status: 'public' | 'private' | 'pending';
  song: {
    id: string;
    title:string;
    imageUrl?: string;
    artists?: { name: string }[];
  };
}

// Component cho Status Badge
const StatusBadge = ({ status }: { status: IKaraoke['status'] }) => {
  const statusConfig = {
    public: {
      text: "Public",
      icon: "earth",
      color: "#28a745",
    },
    private: {
      text: "Private",
      icon: "lock-closed",
      color: "#6c757d",
    },
    pending: {
        text: "Pending",
        icon: "hourglass-outline",
        color: "#ffc107",
    }
  } as const; 

  const config = statusConfig[status] || statusConfig.private;

  return (
    <View style={[styles.statusBadge, { backgroundColor: config.color }]}>
      <Ionicons name={config.icon} size={12} color="white" />
      <Text style={styles.statusBadgeText}>{config.text}</Text>
    </View>
  );
};

const YourVideos = () => {
  const [isMoreMenuVisible, setMoreMenuVisible] = useState<string | null>(null);
  const [karaokes, setKaraokes] = useState<IKaraoke[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKaraokes = async () => {
    try {
      setLoading(true);
      const response = await getAllOwnKaraokesAPI();
      const backendRes = response as IBackendRes<IKaraoke[]>;
      setKaraokes(backendRes?.data || []);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load your karaokes. Please try again later.",
      });
      setKaraokes([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchKaraokes();
    }, [])
  );

  const handleToggleStatus = async (karaokeId: string) => {
    const karaoke = karaokes.find((k) => k.id === karaokeId);
    if (!karaoke) return;
    
    if (karaoke.status === 'private') {
        try {
            await requestPublicKaraokeAPI(karaokeId);
            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Request to make karaoke public has been sent.",
            });
            setKaraokes(prev => prev.map(k => k.id === karaokeId ? { ...k, status: 'pending' } : k));
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to send request to make karaoke public.",
            });
        }
    } else {
      Toast.show({
        type: "info",
        text1: "Info",
        text2: "This action is only available for private karaokes.",
      });
    }
    setMoreMenuVisible(null);
  };
  
  const handleRemoveKaraoke = (karaokeId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this karaoke? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setKaraokes(prev => prev.filter(k => k.id !== karaokeId));
              await deleteKaraokeAPI(karaokeId);
              Alert.alert("Success", "Karaoke has been deleted.");
            } catch (error) {
              Alert.alert("Error", "Failed to remove karaoke. Please refresh.");
              fetchKaraokes();
            }
          },
        },
      ]
    );
    setMoreMenuVisible(null);
  };

  // THAY ĐỔI BỐ CỤC BÊN TRONG CARD
  const renderKaraokeCard = ({ item }: { item: IKaraoke }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => router.push(`/songItem?id=${item.song.id}&karaokeId=${item.id}`)}>
        <ImageBackground
          source={{ uri: item.song.imageUrl || "https://via.placeholder.com/300x169.png?text=No+Image" }}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 12 }}
        >
          {/* Status Badge đã được di chuyển từ đây xuống dưới */}
        </ImageBackground>
      </TouchableOpacity>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.song.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description || "No description"}
        </Text>
        {/* Hàng dưới cùng chứa Status, Artist, và nút More */}
        <View style={styles.bottomRow}>
            <View style={styles.bottomRowLeft}>
                <StatusBadge status={item.status} />
                <Text style={styles.cardArtist} numberOfLines={1}>
                    {item.song.artists?.map((artist) => artist.name).join(", ") || "Unknown Artist"}
                </Text>
            </View>
            <TouchableOpacity 
                style={styles.moreButton}
                onPress={() => setMoreMenuVisible(item.id)}
            >
                <Ionicons name="ellipsis-vertical" size={20} color={APP_COLOR.WHITE} />
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.4]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back-outline" size={25} color={APP_COLOR.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Karaokes</Text>
        <TouchableOpacity onPress={() => router.push("/addSong")} style={styles.headerButton}>
            <Ionicons name="add" size={28} color={APP_COLOR.WHITE} />
        </TouchableOpacity>
      </View>

      {/* Karaoke Grid */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={APP_COLOR.WHITE} />
        </View>
      ) : (
        <FlatList
          data={karaokes}
          renderItem={renderKaraokeCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 8 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.centered}>
              <Ionicons name="videocam-off-outline" size={64} color="rgba(255,255,255,0.5)" />
              <Text style={styles.emptyText}>Your stage is empty... for now!</Text>
              <TouchableOpacity onPress={() => router.push("/addSong")} style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Upload Your First Karaoke</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Menu */}
      {isMoreMenuVisible && (
        <VideoMoreMenu
          visible={!!isMoreMenuVisible}
          onClose={() => setMoreMenuVisible(null)}
          actions={[
            {
                label: "Request to make public",
                icon: "earth-outline",
                onPress: () => handleToggleStatus(isMoreMenuVisible),
                disabled: karaokes.find(k => k.id === isMoreMenuVisible)?.status !== 'private'
            },
            {
                label: "Delete Karaoke",
                icon: "trash-outline",
                onPress: () => handleRemoveKaraoke(isMoreMenuVisible),
                isDestructive: true,
            },
          ]}
        />
      )}
    </LinearGradient>
  );
};

// THAY ĐỔI CÁC STYLE LIÊN QUAN
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingBottom: 10,
        paddingHorizontal: 16,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 50,
    },
    cardContainer: {
        flex: 1,
        margin: 8,
    },
    cardImage: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 12,
        alignSelf: 'flex-start' // Để badge co lại vừa với nội dung
    },
    statusBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    cardInfo: {
        paddingTop: 8,
    },
    cardTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    cardDescription: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8, // Thêm margin dưới
        minHeight: 30, 
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Để chiếm phần lớn không gian
        marginRight: 4, // Khoảng cách với nút more
    },
    cardArtist: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        marginLeft: 6,
        flexShrink: 1, // Cho phép text co lại nếu cần
    },
    moreButton: {
        padding: 4,
    },
    emptyText: {
        color: 'white',
        fontSize: 18,
        marginTop: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    uploadButton: {
        backgroundColor: APP_COLOR.PINK,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        marginTop: 24,
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default YourVideos;