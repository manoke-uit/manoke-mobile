import AnimatedWrapper from "@/components/animation/animate";
import { getAllScores } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

const HistoryTab = () => {
  const [scores, setScores] = useState<IScore[]>([]);

  useEffect(() => {
    fetchScores();
  }, []);

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

                <Text className="text-pink-300 font-bold text-lg">
                  {item.finalScore
                    ? Math.round(item.finalScore * 100) / 100
                    : 0}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default HistoryTab;
