import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
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
import ScoreModal from "@/components/score";

const SongItemScreen = () => {
  const { id } = useLocalSearchParams();
  const [currentSongId, setCurrentSongId] = useState<string>(id as string);
  const [karaokeVideoUrl, setKaraokeVideoUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [songTitle, setSongTitle] = useState<string>("");
  const [artistNames, setArtistNames] = useState<string[]>([]);
  const [songs, setSongs] = useState<ISong[]>([]);
  const [isScoreModalVisible, setScoreModalVisible] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [isReadyModalVisible, setIsReadyModalVisible] = useState(true);
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const videoRef = useRef<Video>(null);

  const fetchSongData = async (songId: string) => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        setRecording(null);
        setIsRecording(false);
      } catch (err) {
        console.warn(" Không thể stop recording:", err);
      }
    }
    try {
      await videoRef.current?.stopAsync();
    } catch (err) {
      console.warn("Không thể stop video:", err);
    }
    try {
      const res = await getKaraokesBySongId(songId);
      const first = res.data?.[0];
      setKaraokeVideoUrl(first?.videoUrl ?? null);
    } catch {
      Alert.alert("Error", "Unable to load karaoke");
    }

    try {
      const songRes = await getSongById(songId);
      setSongTitle(songRes.data?.title ?? "");
      const names = songRes.data?.artists?.map((a: any) => a.name) ?? [];
      setArtistNames(names);
    } catch {
      Alert.alert("Error", "Unable to load song info");
    }

    setIsReadyModalVisible(true);
    setRecording(null);
    setIsRecording(false);
    setScoreModalVisible(false);
  };

  useEffect(() => {
    fetchSongData(currentSongId);

    const loadInit = async () => {
      try {
        const allSongsRes = await getAllSongs();
        setSongs(allSongsRes.data ?? []);
      } catch {
        Alert.alert("Error", "Unable to load song list");
      }

      const acc = await getAccountAPI();
      if (acc?.userId) setUserId(acc.userId);
    };

    loadInit();
  }, []);

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
      setIsReadyModalVisible(false);
    } catch {
      Alert.alert("Error", "Unable to start recording");
    }
  };

  const stopRecordingAndUpload = async () => {
    try {
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      setRecording(null);
      setIsRecording(false);

      if (!uri) {
        Alert.alert("Error", "No recorded file");
        return;
      }

      setIsUploading(true);
      const score = await uploadScoreAudioAPI(uri, currentSongId, userId);
      setScore(score ? Math.round(score * 100) / 100 : 81);
      setIsUploading(false);
      setScoreModalVisible(true);
    } catch {
      setIsUploading(false);
      Alert.alert("Error", "Unable to calculate score");
    }
  };

  const handleVideoStatusUpdate = (status: any) => {
    if (status.didJustFinish && isRecording) {
      stopRecordingAndUpload();
    }
  };

  const handleReadyResponse = (isReady: boolean) => {
    if (isReady) startRecording();
    else router.back();
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.BLACK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <Modal visible={isReadyModalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: APP_COLOR.BLACK,
              borderRadius: 20,
              padding: 20,
              width: "80%",
              alignItems: "center",
              borderWidth: 1,
              borderColor: APP_COLOR.PINK,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 20,
              }}
            >
              Are you ready to sing?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => handleReadyResponse(false)}
                style={{
                  backgroundColor: APP_COLOR.PINK,
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleReadyResponse(true)}
                style={{
                  backgroundColor: APP_COLOR.PURPLE,
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ paddingVertical: 30, paddingHorizontal: 20 }}>
        <TouchableOpacity
          onPress={() => setIsExitModalVisible(true)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#f472b6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back-outline" size={25} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ height: 250 }}>
          {karaokeVideoUrl && (
            <Video
              key={karaokeVideoUrl}
              ref={videoRef}
              source={{ uri: karaokeVideoUrl }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={!isReadyModalVisible}
              onPlaybackStatusUpdate={handleVideoStatusUpdate}
              style={{ width: "100%", height: 250 }}
            />
          )}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              Now Playing
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <View>
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  {songTitle || "Loading..."}
                </Text>
                <Text style={{ color: "#aaa" }}>
                  {artistNames.join(", ") || "Loading artists..."}
                </Text>
              </View>
              <TouchableOpacity
                style={{ marginLeft: "auto", paddingHorizontal: 10 }}
                onPress={() => setMoreMenuVisible(true)}
              >
                <Entypo name="dots-three-vertical" size={20} color="#C0C0C0" />
              </TouchableOpacity>
            </View>

            {isRecording && (
              <Text style={{ color: "red", marginTop: 10, fontWeight: "bold" }}>
                Recording in progress...
              </Text>
            )}
            {isUploading && (
              <Text style={{ color: "yellow", marginTop: 10 }}>
                Calculating score...
              </Text>
            )}

            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                marginVertical: 16,
              }}
            >
              Songs
            </Text>
            {songs.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setCurrentSongId(item.id);
                  fetchSongData(item.id);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Image
                  source={{
                    uri:
                      item.imageUrl ||
                      "https://via.placeholder.com/80x80.png?text=No+Image",
                  }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 10,
                    marginRight: 12,
                  }}
                  resizeMode="cover"
                />
                <View>
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: "#ccc" }}>
                    {item.artists?.map((a) => a.name).join(", ")}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <MoreMenu
        visible={isMoreMenuVisible}
        onClose={() => setMoreMenuVisible(false)}
        onAddToPlaylist={() => console.log("Added to playlist")}
      />

      <ScoreModal
        visible={isScoreModalVisible}
        title="Your Score"
        score={score}
        onClose={() => setScoreModalVisible(false)}
      />
      <Modal visible={isExitModalVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: APP_COLOR.BLACK,
              borderRadius: 20,
              padding: 20,
              width: "80%",
              alignItems: "center",
              borderWidth: 1,
              borderColor: APP_COLOR.PINK,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 20,
              }}
            >
              Bạn có chắc muốn thoát?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => setIsExitModalVisible(false)}
                style={{
                  backgroundColor: APP_COLOR.PINK,
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  try {
                    if (recording) {
                      await recording.stopAndUnloadAsync();
                      setRecording(null);
                      setIsRecording(false);
                    }
                    await videoRef.current?.unloadAsync();
                  } catch (err) {
                    console.warn("Không thể dừng khi thoát:", err);
                  } finally {
                    setIsExitModalVisible(false);
                    router.back();
                  }
                }}
                style={{
                  backgroundColor: APP_COLOR.PURPLE,
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Thoát
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default SongItemScreen;
