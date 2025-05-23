import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import VideoMoreMenu from "@/components/videoMoreMenu";
import { router, useNavigation } from "expo-router";
import { getAllOwnKaraokesAPI, requestPublicKaraokeAPI, deleteKaraokeAPI } from "@/utils/api";

const YourVideos = () => {
  const [isMoreMenuVisible, setMoreMenuVisible] = useState<string | null>(null);
  const [karaokes, setKaraokes] = useState<IKaraoke[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchKaraokes = async () => {
    try {
      setLoading(true);
      const response = await getAllOwnKaraokesAPI();
      const backendRes = response as IBackendRes<IKaraoke[]>;
      if (backendRes?.data) {
        setKaraokes(backendRes.data);
      } else {
        setKaraokes([]);
      }
    } catch (error) {
      console.error('Error fetching karaokes:', error);
      Alert.alert("Error", "Failed to load your karaokes");
      setKaraokes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaraokes();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchKaraokes();
    });
    return unsubscribe;
  }, [navigation]);

  const handleToggleStatus = async (karaokeId: string, currentStatus: "public" | "private") => {
    try {
      if (currentStatus === "private") {
        // Request to make public
        const response = await requestPublicKaraokeAPI(karaokeId);
        const backendRes = response as IBackendRes<IKaraoke>;
        if (backendRes?.data) {
          Alert.alert("Success", "Request to make karaoke public has been sent");
          // Update local state
          setKaraokes(prev => prev.map(k => 
            k.id === karaokeId ? { ...k, status: "public" } : k
          ));
        } else {
          throw new Error("Failed to get response data");
        }
      } else {
        // TODO: Implement private request if needed
        Alert.alert("Info", "Making karaoke private is not implemented yet");
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      Alert.alert("Error", "Failed to update karaoke status");
    }
    setMoreMenuVisible(null);
  };

  const handleRemoveKaraoke = async (karaokeId: string) => {
    try {
      const response = await deleteKaraokeAPI(karaokeId);
      const backendRes = response as IBackendRes<IKaraoke>;
      if (backendRes?.data) {
        Alert.alert("Success", "Karaoke has been deleted");
      }
    } catch (error) {
      console.error('Error removing karaoke:', error);
      Alert.alert("Error", "Failed to remove karaoke");
    }
    setMoreMenuVisible(null);
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.4]}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        {/* Custom Header */}
        <View
          className="w-full flex-row items-center"
          style={{
            paddingVertical: 30,
            paddingHorizontal: 20,
            backgroundColor: "transparent",
          }}
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

          <View className="flex-1 items-center">
            <Text className="text-white text-2xl font-bold">Your Songs</Text>
          </View>

          <View className="w-10" />
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 80,
          }}
          className="flex-1"
        >
          {/* Karaoke List */}
          {loading ? (
            <View className="items-center mt-10">
              <Text className="text-white text-lg">Loading...</Text>
            </View>
          ) : karaokes.length === 0 ? (
            <View className="items-center mt-10">
              <Text className="text-white text-lg font-semibold">
                No karaoke uploaded yet
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/addSong")}
                className="bg-pink-500 rounded-lg px-6 py-3 mt-4"
              >
                <Text className="text-white font-semibold text-base">
                  Upload a Karaoke
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="px-4">
              {karaokes.map((karaoke) => (
                <TouchableOpacity
                  key={karaoke.id}
                  className="flex-row items-center mb-5 border-b border-white/10 pb-4"
                  onPress={() => router.push(`/songItem?id=${karaoke.song.id}`)}
                >
                  <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4">
                    {karaoke.song.imageUrl && (
                      <Image
                        source={{ uri: karaoke.song.imageUrl }}
                        className="w-full h-full rounded-lg"
                      />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      {karaoke.song.title}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {karaoke.song.artists?.map((artist) => artist.name).join(", ") || "Unknown Artist"}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">
                      {karaoke.status === "public"
                        ? "Public (Pending Admin Approval)"
                        : "Private"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setMoreMenuVisible(karaoke.id)}
                    className="ml-2"
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={20}
                      color={APP_COLOR.WHITE}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Karaoke More Menu */}
        {isMoreMenuVisible && (
          <VideoMoreMenu
            visible={!!isMoreMenuVisible}
            onClose={() => setMoreMenuVisible(null)}
            actions={
              isMoreMenuVisible === "global"
                ? [
                    {
                      label: "Upload New Karaoke",
                      onPress: () => router.push("/addSong"),
                    },
                  ]
                : [
                    {
                      label:
                        karaokes.find((k) => k.id === isMoreMenuVisible)
                          ?.status === "public"
                          ? "Make Private"
                          : "Make Public",
                      onPress: () =>
                        handleToggleStatus(
                          isMoreMenuVisible,
                          karaokes.find((k) => k.id === isMoreMenuVisible)!.status
                        ),
                    },
                    {
                      label: "Remove Karaoke",
                      onPress: () => handleRemoveKaraoke(isMoreMenuVisible),
                    },
                  ]
            }
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default YourVideos;
