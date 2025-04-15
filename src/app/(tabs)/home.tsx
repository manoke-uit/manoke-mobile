import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import { getAllSongs } from "@/utils/api";

const HomeTab = () => {
  const [songs, setSongs] = useState<ISong[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSongs = async () => {
      try {
        const res = await getAllSongs();
        setSongs(res.items);
      } catch (error) {
        console.error("Error loading songs", error);
      } finally {
        setLoading(false);
      }
    };
    getSongs();
  }, []);

  return (
    <LinearGradient
      colors={[APP_COLOR.LT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.5]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4">
          <View className="pt-8">
            <View className="bg-pink-500 rounded-xl p-4 mb-6">
              <Text className="text-white text-base font-bold">
                Sing without limits.
              </Text>
              <Text className="text-pink-100 text-sm mt-2">
                Subscribes to unlock full versions of the songs and premium
                features!
              </Text>
            </View>

            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-xl font-bold">Playlists</Text>
                <TouchableOpacity>
                  <Text className="text-white font-bold">See All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {songs.slice(0, 10).map((song, i) => (
                  <View key={i} className="w-[120px] mr-3">
                    <Image
                      source={{ uri: song.imageUrl }}
                      className="w-full h-[120px] rounded-xl mb-2"
                      resizeMode="cover"
                    />
                    <Text
                      className="text-white font-semibold text-sm"
                      numberOfLines={1}
                    >
                      {song.albumTitle}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-xl font-bold">Top Songs</Text>
                <TouchableOpacity>
                  <Text className="text-white font-bold">See All</Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <View className="flex-row flex-wrap justify-between">
                  {songs.slice(0, 6).map((song, i) => (
                    <View key={i} className="w-[48%] mb-4">
                      <Image
                        source={{ uri: song.imageUrl }}
                        className="w-full h-[100px] rounded-xl mb-2"
                        resizeMode="cover"
                      />
                      <Text className="text-white font-bold" numberOfLines={1}>
                        {song.title}
                      </Text>
                      <Text className="text-gray-400 text-sm" numberOfLines={1}>
                        {song.albumTitle}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default HomeTab;
