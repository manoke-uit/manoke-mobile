import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const ChangeUsername = () => {
  const router = useRouter();
  const [username, setUsername] = useState("admin");

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleDone = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.replace("/home");
    });
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.25]}
      style={{ flex: 1 }}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View className="flex-1 px-6 pt-10">
          <View className="flex-row justify-between mb-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-pink-400">{"<"} Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDone}>
              <Text className="text-pink-400 font-bold">Done</Text>
            </TouchableOpacity>
          </View>

          <View className="items-center mb-6">
            <Ionicons name="create" size={48} color="pink" />
            <Text className="text-white font-bold text-2xl mt-2">
              Change Username
            </Text>
            <Text className="text-gray-300 mt-1">Enter your username</Text>
          </View>

          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="admin"
            placeholderTextColor="#999"
            className="bg-neutral-700 text-white px-4 py-3 rounded-lg"
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

export default ChangeUsername;
