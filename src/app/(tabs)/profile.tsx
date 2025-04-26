import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { MotiPressable } from "moti/interactions";
import AnimatedWrapper from "@/components/animation/animate";
import { getAccountAPI } from "@/utils/api";
const ProfileTab = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await getAccountAPI();
        setEmail(res.email);
      } catch (error) {
        console.log("Lỗi load profile:", error);
      }
    };

    fetchEmail();
  }, []);

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.3]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <View className="px-6 pt-12 flex-1 mb-8">
          <View className="items-center mb-10">
            <View className="w-20 h-20 bg-pink-200 rounded-full items-center justify-center">
              <Ionicons name="person" size={40} color="#000" />
            </View>
            <Text className="text-white font-bold text-xl mt-3">
              {email || "Loading..."}
            </Text>
          </View>

          <View className="space-y-3">
            <MotiPressable
              from={{ scale: 1 }}
              animate={({ pressed }) => ({
                scale: pressed ? 0.95 : 1,
              })}
              transition={{ type: "timing", duration: 150 }}
              onPress={() => router.push("/record")}
              style={{
                backgroundColor: "#171717",
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="mic-outline" size={20} color="white" />
                <Text style={{ color: "white", marginLeft: 12 }}>
                  Your Recordings
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="white" />
            </MotiPressable>

            <MotiPressable
              from={{ scale: 1 }}
              animate={({ pressed }) => ({
                scale: pressed ? 0.95 : 1,
              })}
              transition={{ type: "timing", duration: 150 }}
              onPress={() => router.push("/playlist")}
              style={{
                backgroundColor: "#171717",
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="musical-notes-outline"
                  size={20}
                  color="white"
                />
                <Text style={{ color: "white", marginLeft: 12 }}>
                  Your Playlists
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="white" />
            </MotiPressable>
          </View>

          <View className="mt-auto mb-10">
            <MotiPressable
              from={{ scale: 1 }}
              animate={({ pressed }) => ({
                scale: pressed ? 0.95 : 1,
              })}
              transition={{ type: "timing", duration: 150 }}
              onPress={() => console.log("Log out")}
              style={{
                backgroundColor: "#171717",
                paddingVertical: 12,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#f87171", fontWeight: "bold" }}>
                Log out
              </Text>
            </MotiPressable>
          </View>
        </View>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default ProfileTab;
