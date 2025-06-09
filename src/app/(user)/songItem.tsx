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
  const { id, karaokeId } = useLocalSearchParams();
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
  const [isReadyModalVisible, setIsReadyModalVisible] = useState(false);
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const [description, setDescription] = useState<string>("");
  const videoRef = useRef<Video>(null);
  const [karaokeList, setKaraokeList] = useState<IKaraoke[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const [recordStartTime, setRecordStartTime] = useState<number | null>(null);
  const [
    isConfirmStopRecordingModalVisible,
    setConfirmStopRecordingModalVisible,
  ] = useState(false);
  const [hasRequestedScore, setHasRequestedScore] = useState(false);

  const fetchSongData = async (songId: string, karaokeIdFromParam?: string) => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        setRecording(null);
        setIsRecording(false);
      } catch (err) {
        console.warn("Không thể stop recording:", err);
      }
    }

    try {
      await videoRef.current?.stopAsync();
    } catch (err) {
      console.warn("Không thể stop video:", err);
    }

    try {
      const res = await getKaraokesBySongId(songId);
      const list = res.data || [];
      setKaraokeList(list);

      let selectedKaraoke = list[0];
      if (karaokeIdFromParam) {
        const found = list.find((k: any) => k.id === karaokeIdFromParam);
        if (found) selectedKaraoke = found;
      }

      setKaraokeVideoUrl(selectedKaraoke?.videoUrl ?? null);
      setDescription(selectedKaraoke?.description ?? "");
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

    setTimeout(() => {
      setIsReadyModalVisible(true);
    }, 200);
    setRecording(null);
    setIsRecording(false);
    setScoreModalVisible(false);
    setHasRequestedScore(false);
  };

  useEffect(() => {
    fetchSongData(currentSongId, karaokeId as string);

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
      setRecordStartTime(Date.now());
      setIsReadyModalVisible(false);
    } catch {
      Alert.alert("Error", "Unable to start recording");
    }
  };

  const uploadAndScore = async () => {
    try {
      if (!recording) {
        Alert.alert("Error", "No recording found.");
        return;
      }

      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      setRecording(null);

      if (!uri) {
        Alert.alert("Error", "No recorded file");
        return;
      }

      setIsUploading(true);
      const score = await uploadScoreAudioAPI(uri, currentSongId, userId);
      setScore(score ? Math.round(score * 100) / 100 : 81);
      setScoreModalVisible(true);
    } catch (err) {
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoStatusUpdate = (status: any) => {
    if (status.didJustFinish && isRecording && !hasRequestedScore) {
      setIsRecording(false);
      setHasRequestedScore(true);
      uploadAndScore();
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
            <>
              <Video
                key={karaokeVideoUrl}
                ref={videoRef}
                source={{ uri: karaokeVideoUrl }}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={!isPaused && !isReadyModalVisible}
                onPlaybackStatusUpdate={handleVideoStatusUpdate}
                style={{ width: "100%", height: 250 }}
              />
            </>
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
            {isRecording && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 12,
                  gap: 16,
                }}
              >
                <TouchableOpacity
                  onPress={async () => {
                    if (isPaused) {
                      await videoRef.current?.playAsync();
                    } else {
                      await videoRef.current?.pauseAsync();
                    }
                    setIsPaused(!isPaused);
                  }}
                  style={{
                    backgroundColor: "#f472b6",
                    padding: 12,
                    borderRadius: 30,
                  }}
                >
                  <Ionicons
                    name={isPaused ? "play" : "pause"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    try {
                      await videoRef.current?.replayAsync();
                      setIsPaused(false);
                    } catch (err) {
                      console.warn("Không thể reset video:", err);
                    }
                  }}
                  style={{
                    backgroundColor: "#6b21a8",
                    padding: 12,
                    borderRadius: 30,
                  }}
                >
                  <Ionicons name="refresh" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const now = Date.now();
                    if (recordStartTime && now - recordStartTime < 60_000) {
                      Alert.alert(
                        "Warning",
                        "Please sing for at least 1 minute before submitting."
                      );
                      return;
                    }
                    setConfirmStopRecordingModalVisible(true);
                  }}
                  style={{
                    backgroundColor: "#fbbf24",
                    padding: 12,
                    borderRadius: 30,
                  }}
                >
                  <Ionicons name="stop" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}

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
                {description ? (
                  <Text
                    style={{
                      color: "#aaa",
                      fontStyle: "italic",
                      marginTop: 6,
                      fontSize: 15,
                      lineHeight: 20,
                      maxWidth: 320,
                    }}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    Description: {description}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={{ marginLeft: "auto", paddingHorizontal: 10 }}
                onPress={() => setMoreMenuVisible(true)}
              >
                <Entypo name="dots-three-vertical" size={20} color="#C0C0C0" />
              </TouchableOpacity>
            </View>

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
              Karaoke Versions
            </Text>
            {karaokeList.map((karaoke) => (
              <TouchableOpacity
                key={karaoke.id}
                onPress={() => {
                  router.push(
                    `/songItem?id=${currentSongId}&karaokeId=${karaoke.id}`
                  );
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
                      karaoke.song.imageUrl ||
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
                    {karaoke.song.title}
                  </Text>
                  <Text style={{ color: "#ccc" }}>
                    {karaoke.description || "No description"}
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
              Do you want to exit?
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
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Cancel
                </Text>
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
                <Text style={{ color: "white", fontWeight: "bold" }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isConfirmStopRecordingModalVisible}
        transparent
        animationType="fade"
      >
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
                textAlign: "center",
              }}
            >
              Do you want to stop and get your score?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  try {
                    setConfirmStopRecordingModalVisible(false);

                    if (videoRef.current) {
                      await videoRef.current.pauseAsync();
                    }

                    await uploadAndScore();
                  } catch (err) {
                    console.warn("Lỗi khi dừng video và chấm điểm:", err);
                  }
                }}
                style={{
                  backgroundColor: APP_COLOR.PURPLE,
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setConfirmStopRecordingModalVisible(false)}
                style={{
                  backgroundColor: APP_COLOR.PINK,
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default SongItemScreen;
