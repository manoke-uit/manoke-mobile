import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { router, useLocalSearchParams } from "expo-router";
import {
  getPlaylistById,
  getSongsInPlaylistAPI,
  removeSongFromPlaylistAPI,
} from "@/utils/api";
import Toast from "react-native-toast-message";
import VideoMoreMenu from "@/components/videoMoreMenu";

const PlaylistSong = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistImage, setPlaylistImage] = useState("");
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [songs, setSongs] = useState<
    {
      id: string;
      title: string;
      imageUrl?: string;
      artists: { name: string }[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPlaylistData = async () => {
      setLoading(true);
      try {
        const [playlistDetails, songsList] = await Promise.all([
          getPlaylistById(id),
          getSongsInPlaylistAPI(id),
        ]);
        setPlaylistTitle(playlistDetails.title);
        setPlaylistImage(playlistDetails.imageUrl);
        setSongs(songsList || []);
      } catch (err: any) {
        // console.error("Lỗi tải dữ liệu playlist:", err);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Cannot load data playlist",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistData();
  }, [id]);

  const handleNavigateToKaraoke = (songId: string) => {
    router.push(`/chooseKaraokes?id=${songId}`);
  };

  const handleRemoveSong = async () => {
    if (!selectedSongId || !id) return;
    try {
      await removeSongFromPlaylistAPI(id, selectedSongId);
      setSongs((prev) => prev.filter((s) => s.id !== selectedSongId));
      Toast.show({
        type: "success",
        text1: "success",
        text2: "Song removed from playlist",
      });
    } catch (err) {
      // console.error("Error:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Cannot remove song from playlist",
      });
    } finally {
      setMoreMenuVisible(false);
      setSelectedSongId(null);
    }
  };

  const SongItem = ({
    id,
    title,
    imageUrl,
  }: {
    id: string;
    title: string;
    imageUrl?: string;
  }) => (
    <View
      key={id}
      className="flex-row items-center mb-5 border-b border-white/10 pb-4"
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
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
        <Text className="text-white font-bold">{title}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setSelectedSongId(id);
          setMoreMenuVisible(true);
        }}
        className="ml-2"
      >
        <Ionicons name="ellipsis-vertical" size={20} color={APP_COLOR.WHITE} />
      </TouchableOpacity>
    </View>
  );

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
        {loading ? (
          <ActivityIndicator
            size="large"
            color={APP_COLOR.WHITE}
            style={{ marginTop: 50 }}
          />
        ) : (
          <>
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
              {playlistTitle}
            </Text>

            <View className="px-4">
              {songs.map((s) => (
                <TouchableOpacity 
                  key={s.id}
                  onPress={() => handleNavigateToKaraoke(s.id)}
                >
                  <SongItem key={s.id} {...s} />
                </TouchableOpacity>
                
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <VideoMoreMenu
        visible={isMoreMenuVisible}
        onClose={() => {
          setMoreMenuVisible(false);
          setSelectedSongId(null);
        }}
        actions={[
          {
            label: "Xoá khỏi playlist",
            icon: "trash-outline",
            isDestructive: true,
            onPress: handleRemoveSong,
          },
        ]}
      />
    </LinearGradient>
  );
};

export default PlaylistSong;
