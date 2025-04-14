import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";

const SearchTab = () => {
  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 1]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4">
          <View className="pt-8">
            <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-xl mb-6">
              <Ionicons
                name="search"
                size={20}
                color="white"
                className="mr-2"
              />
              <TextInput
                placeholder="Songs, Artists, Playlists..."
                placeholderTextColor="#eee"
                className="flex-1 text-white"
              />
            </View>
            <View className="flex-row flex-wrap justify-between">
              {[...Array(12)].map((_, i) => (
                <View key={i} className="w-[32%] mb-4">
                  <View className="w-full h-[100px] bg-neutral-300 rounded-xl mb-2" />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default SearchTab;
