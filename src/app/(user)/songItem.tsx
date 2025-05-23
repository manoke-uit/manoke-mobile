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
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
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
  const [isVideoEnded, setIsVideoEnded] = useState(false);

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
        Alert.alert("Error", "Unable to load karaoke");
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
        Alert.alert("Error", "Unable to load song information");
      }

      try {
        const allSongsRes = await getAllSongs();
        setSongs(allSongsRes.data ?? []);
      } catch {
        Alert.alert("Error", "Unable to load song list");
      }

      const acc = await getAccountAPI();
      if (acc?.userId) setUserId(acc.userId);
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
      setIsReadyModalVisible(false);
    } catch (err) {
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
        Alert.alert("Error", "No recorded file found to upload");
        return;
      }

      setIsUploading(true);
      const score = await uploadScoreAudioAPI(uri, id as string, userId);
      const roundedScore = score ? Math.round(score * 100) / 100 : 81;

      setIsUploading(false);
      setScore(roundedScore); 
      setScoreModalVisible(true); 
    } catch (err) {
      console.error("Upload audio failed:", err);
      setIsUploading(false);
      Alert.alert("Error", "Unable to calculate score");
    }
  };

  const handleVideoStatusUpdate = (status: any) => {
    if (status.didJustFinish) {
      setIsVideoEnded(true);
      if (isRecording) {
        stopRecordingAndUpload();
      }
    }
  };

  const handleReadyResponse = (isReady: boolean) => {
    if (isReady) {
      startRecording();
    } else {
      router.back();
    }
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.BLACK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Ready Modal */}
      <Modal
        visible={isReadyModalVisible}
        transparent
        animationType="fade"
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: APP_COLOR.BLACK,
            borderRadius: 20,
            padding: 20,
            width: '80%',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: APP_COLOR.PINK
          }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 24, 
              fontWeight: 'bold',
              marginBottom: 20,
              textAlign: 'center'
            }}>
              Are you ready to sing?
            </Text>
            <View style={{ 
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%'
            }}>
              <TouchableOpacity
                onPress={() => handleReadyResponse(false)}
                style={{
                  backgroundColor: APP_COLOR.PINK,
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                  marginHorizontal: 10
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleReadyResponse(true)}
                style={{
                  backgroundColor: APP_COLOR.PURPLE,
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                  marginHorizontal: 10
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
          <View className="w-full px-5 py-4">
            <Text className="text-white font-bold text-2xl mb-2">
              Now Playing
            </Text>
            <View className="flex-row items-center mb-5">
              <View className="justify-center">
                <Text className="text-white font-bold text-xl">
                  {songTitle || "Loading..."}
                </Text>
                <Text className="text-gray-400 text-base">
                  {artistNames.join(", ") || "Loading artists..."}
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
              {isRecording && (
                <Text className="text-red-500 font-bold">
                  Recording in progress...
                </Text>
              )}
            </View>

            {isUploading && (
              <Text className="text-yellow-400 mt-2 text-center">
                Calculating score...
              </Text>
            )}

            <Text className="text-white font-bold text-2xl my-4">Songs</Text>
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
        onAddToPlaylist={() => console.log("Added to playlist")}
      />

      <ScoreModal
        visible={isScoreModalVisible}
        title="Your Score"
        score={score}
        onClose={() => setScoreModalVisible(false)}
      />
    </LinearGradient>
  );
};

export default SongItemScreen;