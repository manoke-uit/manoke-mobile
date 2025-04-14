import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";

const HomeTab = () => {
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
            <View className="bg-pink-500 rounded-xl p-4 mb-6 ">
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
                {[...Array(5)].map((_, i) => (
                  <View
                    key={i}
                    className="w-[100px] h-[100px] bg-neutral-300  rounded-xl mr-3"
                  />
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
              <View className="flex-row flex-wrap justify-between">
                {[...Array(6)].map((_, i) => (
                  <View key={i} className="w-[48%] mb-4">
                    <View className="w-full h-[100px] bg-neutral-300 rounded-xl mb-2" />
                    <Text className="text-white font-bold">Song</Text>
                    <Text className="text-gray-400 text-sm">Artist</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default HomeTab;
