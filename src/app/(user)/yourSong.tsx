import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import VideoMoreMenu from "@/components/videoMoreMenu"; 
import { router, useNavigation } from "expo-router";
import { useVideos } from "@/app/context/videoContext";

const YourVideos = () => {
  const [isMoreMenuVisible, setMoreMenuVisible] = useState<string | null>(null);
  const { videos, updateVideoStatus, removeVideo } = useVideos();
  const navigation = useNavigation();

  useEffect(() => {
    console.log("Current videos:", videos);
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("YourVideos focused, videos:", videos);
    });
    return unsubscribe;
  }, [videos, navigation]);

  const handleToggleStatus = (videoId: string, currentStatus: "public" | "private") => {
    const newStatus = currentStatus === "public" ? "private" : "public";
    updateVideoStatus(videoId, newStatus);
    if (newStatus === "public") {
      console.log(`Admin request sent for video ID: ${videoId}`);
      // call API
    }
    setMoreMenuVisible(null);
  };

  const handleRemoveVideo = (videoId: string) => {
    removeVideo(videoId);
    setMoreMenuVisible(null);
    console.log(`Removed video ${videoId}`);
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
                <Ionicons name="chevron-back-outline" size={25} color={APP_COLOR.WHITE} />
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
          {/* Video List */}
          {videos.length === 0 ? (
            <View className="items-center mt-10">
              <Text className="text-white text-lg font-semibold">No song uploaded yet</Text>
              <TouchableOpacity
                onPress={() => router.push("/addSong")}
                className="bg-pink-500 rounded-lg px-6 py-3 mt-4"
              >
                <Text className="text-white font-semibold text-base">Upload a Song</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="px-4">
              {videos.map((video) => (
                <View
                  key={video.id}
                  className="flex-row items-center mb-5 border-b border-white/10 pb-4"
                >
                  <View className="w-16 h-16 bg-gray-400 rounded-lg mr-4" />
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">{video.title}</Text>
                    <Text className="text-gray-400 text-sm">{video.artist}</Text>
                    <Text className="text-gray-400 text-xs mt-1">
                      {video.status === "public" ? "Public (Pending Admin Approval)" : "Private"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setMoreMenuVisible(video.id)}
                    className="ml-2"
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={20}
                      color={APP_COLOR.WHITE}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Video More Menu */}
        {isMoreMenuVisible && (
          <VideoMoreMenu
            visible={!!isMoreMenuVisible}
            onClose={() => setMoreMenuVisible(null)}
            actions={
              isMoreMenuVisible === "global"
                ? [
                    { label: "Upload New Video", onPress: () => router.push("/addSong") },
                    { label: "Cancel", onPress: () => router.back() },
                  ]
                : [
                    {
                      label: videos.find((v) => v.id === isMoreMenuVisible)?.status === "public"
                        ? "Make Private"
                        : "Make Public",
                      onPress: () =>
                        handleToggleStatus(
                          isMoreMenuVisible,
                          videos.find((v) => v.id === isMoreMenuVisible)!.status
                        ),
                    },
                    {
                      label: "Remove Video",
                      onPress: () => handleRemoveVideo(isMoreMenuVisible),
                    },
                    { label: "Cancel", onPress: () => setMoreMenuVisible(null) },
                  ]
            }
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default YourVideos;