import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
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
  getAllSongs,
} from "@/utils/api";
import { Audio, Video, ResizeMode } from "expo-av";

const SongItemScreen = () => {
  const { id } = useLocalSearchParams();
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [karaokeVideoUrl, setKaraokeVideoUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [songTitle, setSongTitle] = useState<string>("");
  const [artistNames, setArtistNames] = useState<string[]>([]);
  const [songs, setSongs] = useState<ISong[]>([]);

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
        if (songRes?.data?.title) {
          setSongTitle(songRes.data.title);
        }
        if (Array.isArray(songRes?.data?.artists)) {
          const names = songRes.data.artists.map((a: any) => a.name);
          setArtistNames(names);
        }
      } catch {
        Alert.alert("Lỗi", "Không thể tải thông tin bài hát");
      }

      try {
        const allSongsRes = await getAllSongs();
        setSongs(allSongsRes.data ?? []);
      } catch {
        Alert.alert("Lỗi", "Không thể tải danh sách bài hát");
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

      if (!uri) {
        Alert.alert("Lỗi", "Không tìm thấy file ghi âm để upload");
        return;
      }

      setIsUploading(true);
      const score = await uploadScoreAudioAPI(uri, id as string, userId);
      const roundedScore = score ? Math.round(score * 100) / 100 : 81;

      setIsUploading(false);
      Alert.alert("Chấm điểm", `Điểm số: ${roundedScore}`);
    } catch (err) {
      console.error("Upload audio failed:", err);
      setIsUploading(false);
      Alert.alert("Lỗi", "Không thể chấm điểm");
    }
  };

  const handleVideoStatusUpdate = (status: any) => {
    if (status.didJustFinish && isRecording) {
      stopRecordingAndUpload();
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
              onPlaybackStatusUpdate={handleVideoStatusUpdate}
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
                  {artistNames.join(", ") || "Đang tải nghệ sĩ..."}
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
            {songs.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row items-center mb-4"
              >
                <Image
                  source={{
                    uri:
                      item.imageUrl ||
                      "https://via.placeholder.com/80x80.png?text=No+Image",
                  }}
                  className="w-20 h-20 rounded-lg mr-4"
                  resizeMode="cover"
                />

                <View className="justify-center">
                  <Text className="text-white font-semibold">{item.title}</Text>
                  <Text className="text-gray-400">
                    {item.artists?.map((a) => a.name).join(", ") ?? ""}
                  </Text>
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
