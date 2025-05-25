import AnimatedWrapper from "@/components/animation/animate";
import { getAllScores } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Audio } from 'expo-av';
import Toast from "react-native-toast-message";
import { useNavigation } from "expo-router";

const HistoryTab = () => {
  const [scores, setScores] = useState<IScore[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const currentOffset = useRef(0);
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const diff = offsetY - currentOffset.current;

    if (diff > 10 && visible) {
      setVisible(false);
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else if (diff < -10 && !visible) {
      setVisible(true);
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          height: 70,
        },
      });
    }

    currentOffset.current = offsetY;
  };

  useEffect(() => {
    fetchScores();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async (audioUrl: string, scoreId: string) => {
    try {
      // Stop current playing audio if any
      if (sound) {
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch (error) {
          console.log('Error stopping previous sound:', error);
        }
      }

      // If clicking the same score, toggle play/pause
      if (currentPlayingId === scoreId && isPlaying[scoreId]) {
        try {
          await sound?.pauseAsync();
          setIsPlaying(prev => ({ ...prev, [scoreId]: false }));
        } catch (error) {
          console.log('Error pausing sound:', error);
        }
        return;
      }

      // Load and play new audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(prev => ({ ...prev, [scoreId]: false }));
            setCurrentPlayingId(null);
          }
        }
      );
      setSound(newSound);
      setCurrentPlayingId(scoreId);
      setIsPlaying(prev => ({ ...prev, [scoreId]: true }));

    } catch (error) {
      console.error('Error playing sound:', error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to play audio. Please try again.",
      });
      setIsPlaying(prev => ({ ...prev, [scoreId]: false }));
      setCurrentPlayingId(null);
    }
  };

  const fetchScores = async () => {
    try {
      const res = await getAllScores();
      setScores(res ?? []);
    } catch (error) {
      // console.error("Failed to fetch scores:", error);
    }
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.3]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16, paddingTop: 32 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-xl mb-6">
            <Ionicons name="search" size={20} color="white" className="mr-2" />
            <TextInput
              placeholder="Search by song or user..."
              placeholderTextColor="#eee"
              className="flex-1 text-white"
            />
          </View>

          <View className="mt-5">
            {scores.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row items-center mb-5 border-b border-white/10 pb-4"
              >
                <Image
                  source={{
                    uri:
                      item.song?.imageUrl || "https://via.placeholder.com/100",
                  }}
                  className="w-16 h-16 rounded-lg mr-4 bg-gray-400"
                  resizeMode="cover"
                />

                <View className="flex-1">
                  <Text className="text-white font-bold">
                    {item.song?.title ?? "Unknown Song"}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {item.user?.displayName ?? "Unknown User"} •{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "Unknown Date"}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Text className="text-pink-300 font-bold text-lg mr-3">
                    {item.finalScore
                      ? Math.round(item.finalScore * 100) / 100
                      : 0}
                  </Text>
                  <TouchableOpacity
                    onPress={() => playSound(item.audioUrl, item.id)}
                    className="bg-pink-500 rounded-full p-2"
                  >
                    <Ionicons
                      name={isPlaying[item.id] ? "pause" : "play"}
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default HistoryTab;
