import React, { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { MotiPressable } from "moti/interactions";
import AnimatedWrapper from "@/components/animation/animate";
import { getUserByIdAPI } from "@/utils/api";
import { useCurrentApp } from "../context/appContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileTab = () => {
  const navigation = useNavigation();
  const { setAppState } = useCurrentApp();
  const [username, setUsername] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;
        const res = await getUserByIdAPI(userId);
        setUsername(res.displayName || res.data?.displayName);
        setImageUrl(res.imageUrl || res.data?.imageUrl || null);
      } catch (error) {
        // handle error
      }
    };
    fetchUsername();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("userId");
      setAppState(null);
      router.replace("/(auth)/start");
    } catch (err) {
      // console.log("An error occured", err);
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
        <View style={{ flex: 1, paddingHorizontal: 24, marginTop: 30}}>
          {/* Profile Info */}
          <View style={{ alignItems: 'center'}}>
            <View style={{ width: 80, height: 80, backgroundColor: '#fbcfe8', borderRadius: 40, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={{ width: 80, height: 80, borderRadius: 40 }} />
              ) : (
                <Ionicons name="person" size={40} color="#000" />
              )}
            </View>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginTop: 12 }}>{username || "Loading..."}</Text>
          </View>

          {/* Tabs */}
          <View style={{ gap: 8, marginTop: 45  }}>
            <MotiPressable
              from={{ scale: 1 }}
              animate={({ pressed }) => ({ scale: pressed ? 0.95 : 1 })}
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
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="mic-outline" size={20} color="white" />
                <Text style={{ color: "white", marginLeft: 12 }}>Your Recordings</Text>
              </View>
              <Feather name="chevron-right" size={20} color="white" />
            </MotiPressable>

            <MotiPressable
              from={{ scale: 1 }}
              animate={({ pressed }) => ({ scale: pressed ? 0.95 : 1 })}
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
                <Ionicons name="musical-notes-outline" size={20} color="white" />
                <Text style={{ color: "white", marginLeft: 12 }}>Your Playlists</Text>
              </View>
              <Feather name="chevron-right" size={20} color="white" />
            </MotiPressable>

            <MotiPressable
              from={{ scale: 1 }}
              animate={({ pressed }) => ({ scale: pressed ? 0.95 : 1 })}
              transition={{ type: "timing", duration: 150 }}
              onPress={() => router.push("/addSong")}
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
                <Ionicons name="add-circle-outline" size={20} color="white" />
                <Text style={{ color: "white", marginLeft: 12 }}>Add a song</Text>
              </View>
              <Feather name="chevron-right" size={20} color="white" />
            </MotiPressable>
          </View>

          <View style={{ alignContent: 'flex-end', marginTop: 100}}>
            <MotiPressable
              from={{ scale: 1 }}
              animate={({ pressed }) => ({ scale: pressed ? 0.95 : 1 })}
              transition={{ type: "timing", duration: 150 }}
              onPress={handleLogout}
              style={{
                backgroundColor: "#171717",
                paddingVertical: 14,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#f87171", fontWeight: "bold", fontSize: 16 }}>Log out</Text>
            </MotiPressable>
          </View>
        </View>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default ProfileTab;