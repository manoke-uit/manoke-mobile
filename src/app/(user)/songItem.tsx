import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import MoreMenu from "@/components/moreMenu";
import {
  getAccountAPI,
  uploadScoreAudioAPI,
  getKaraokesBySongId,
  getSongById,
} from "@/utils/api";
import { Audio, Video, ResizeMode } from "expo-av";

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
  const { id } = useLocalSearchParams();
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [karaokeVideoUrl, setKaraokeVideoUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [songTitle, setSongTitle] = useState<string>("");
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getKaraokesBySongId(id as string);
        const first = res.data?.[0];
        if (first?.videoUrl) {
          setKaraokeVideoUrl(first.videoUrl);
        }
      } catch {
        Alert.alert("Lỗi", "Không thể tải karaoke");
      }

      try {
        const songRes = await getSongById(id as string);
        console.log(songRes);
        if (songRes?.data?.title) {
          setSongTitle(songRes.data.title);
        }
      } catch {
        Alert.alert("Lỗi", "Không thể tải thông tin bài hát");
      }

      const acc = await getAccountAPI();
      if (acc?.userId) setUserId(acc.userId);

      await startRecording();
    };

    if (id) fetchData();
  }, [id]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể bắt đầu ghi âm");
    }
  };

  const stopRecordingAndUpload = async () => {
    try {
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      setRecording(null);
      setIsRecording(false);

      if (!uri) return;
      setIsUploading(true);
      const score = await uploadScoreAudioAPI(uri, song[0].id, userId);
      setIsUploading(false);
      Alert.alert("Chấm điểm", `Điểm số: ${score?.finalScore ?? "?"}`);
    } catch (err) {
      setIsUploading(false);
      Alert.alert("Lỗi", "Không thể chấm điểm");
    }
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
          {karaokeVideoUrl && (
            <Video
              ref={videoRef}
              source={{ uri: karaokeVideoUrl }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              style={{ width: "100%", height: 250 }}
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
                  {songTitle || "Đang tải..."}
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

            <View className="flex-row justify-around mt-2">
              {!isRecording ? (
                <TouchableOpacity
                  onPress={startRecording}
                  className="bg-green-600 px-4 py-2 rounded"
                >
                  <Text className="text-white font-bold">🎤 Ghi âm</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={stopRecordingAndUpload}
                  className="bg-red-600 px-4 py-2 rounded"
                >
                  <Text className="text-white font-bold">
                    ⏹ Dừng & Chấm điểm
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {isUploading && (
              <Text className="text-yellow-400 mt-2 text-center">
                Đang chấm điểm...
              </Text>
            )}

            <Text className="text-white font-bold text-2xl my-4">Queue</Text>
            {song.map((item) => (
              <TouchableOpacity
                key={item.id}
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
        onRemoveFromQueue={() => console.log("Removed from queue")}
        onAddToFavorite={() => console.log("Added to favorite")}
        onRemoveFromFavorite={() => {}}
        onAddToPlaylist={() => console.log("Added to playlist")}
        isFavoriteTab={false}
        isQueueTab={true}
      />
    </LinearGradient>
  );
};

export default SongItemScreen;
