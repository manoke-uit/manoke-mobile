import AnimatedWrapper from "@/components/animation/animate";
import { getScoresAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Text, TextInput, View, ScrollView, Image } from "react-native";

const HistoryTab = () => {
  const [scores, setScores] = useState<IScore[]>([]);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const res = await getScoresAPI();
      setScores(res.items);
    } catch (error) {
      console.error("Failed to fetch scores:", error);
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
        <ScrollView className="flex-1 px-4 pt-8">
          <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-xl mb-6">
            <Ionicons name="search" size={20} color="white" className="mr-2" />
            <TextInput
              placeholder="Try typing a song or an artist..."
              placeholderTextColor="#eee"
              className="flex-1 text-white"
            />
          </View>

          <View className="mt-5">
            {/* {scores.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center mb-5 border-b border-white/10 pb-4"
              >
                <Image
                  source={{ uri: item.img || 'https://via.placeholder.com/150' }}
                  className="w-16 h-16 rounded-lg mr-4 bg-gray-400"
                />

                <View className="flex-1">
                  <Text className="text-white font-bold">
                    {item.audioUrl ?? "Unknown Song"}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "Unknown Date"}
                  </Text>
                </View>

                <Text className="text-pink-300 font-bold text-lg">
                  {item.finalScore ?? 0}
                </Text>
              </View>
            ))} */}
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default HistoryTab;