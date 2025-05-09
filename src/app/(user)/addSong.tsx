import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useVideos } from "@/app/context/videoContext";
import { v4 as uuidv4 } from "uuid";

const AddVideo = () => {
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [status, setStatus] = useState<"public" | "private">("private");
  const { addVideo } = useVideos();

  const handleUploadVideo = async () => {
    setUploading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        console.log("Selected video:", result.assets[0]);
        setUploadSuccess(true);
      } else {
        console.log("Video selection canceled");
      }
    } catch (error) {
      console.error("Video upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitVideo = () => {
    if (songTitle.trim() && artistName.trim()) {
      const newVideo = {
        id: uuidv4(),
        title: songTitle,
        artist: artistName,
        status,
      };
      console.log("Submitting video:", newVideo);
      addVideo(newVideo);
      if (status === "public") {
        console.log(`Admin request sent for video: ${newVideo.title}`);
        // call API
      }
      setSongTitle("");
      setArtistName("");
      setUploadSuccess(false);
      setStatus("private");
      router.replace("/yourSong"); 
    }
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
                <Text className="text-white text-2xl font-bold">Add New Song</Text>
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
          {/* Upload Area */}
          <View className="bg-white/10 rounded-xl p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <Ionicons name="videocam-outline" size={40} color={APP_COLOR.WHITE} className="mr-3" />
              <Text className="text-white font-semibold text-lg">Upload Song from Device</Text>
            </View>
            <TouchableOpacity
              onPress={handleUploadVideo}
              disabled={uploading || uploadSuccess}
              className={`bg-pink-500 rounded-lg px-6 py-3 flex-row items-center justify-center ${
                uploading || uploadSuccess ? "opacity-50" : ""
              }`}
            >
              {uploading ? (
                <ActivityIndicator size="small" color={APP_COLOR.WHITE} className="mr-2" />
              ) : (
                <Ionicons name="film-outline" size={20} color={APP_COLOR.WHITE} className="mr-2" />
              )}
              <Text className="text-white font-semibold text-base">
                {uploading ? "Uploading..." : uploadSuccess ? "Uploaded" : "Upload Video"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Video Details Input (shown after successful upload) */}
          {uploadSuccess && (
            <View className="bg-white/10 rounded-xl p-6 mb-6">
              <View className="flex-row items-center mb-4">
                <Ionicons name="pencil-outline" size={30} color={APP_COLOR.WHITE} className="mr-3" />
                <Text className="text-white font-semibold text-lg">Song Details</Text>
              </View>
              <TextInput
                placeholder="Song Title"
                placeholderTextColor="#eee"
                value={songTitle}
                onChangeText={setSongTitle}
                className="text-white text-base bg-white/5 rounded-lg px-4 py-3 mb-4"
              />
              <TextInput
                placeholder="Artist Name"
                placeholderTextColor="#eee"
                value={artistName}
                onChangeText={setArtistName}
                className="text-white text-base bg-white/5 rounded-lg px-4 py-3 mb-4"
              />
              <View className="flex-row mb-4">
                <TouchableOpacity
                  onPress={() => setStatus("private")}
                  className={`flex-1 rounded-lg py-3 mr-2 ${
                    status === "private" ? "bg-pink-500" : "bg-white/10"
                  }`}
                >
                  <Text className="text-white text-center font-semibold">Private</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setStatus("public")}
                  className={`flex-1 rounded-lg py-3 ml-2 ${
                    status === "public" ? "bg-pink-500" : "bg-white/10"
                  }`}
                >
                  <Text className="text-white text-center font-semibold">Public</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-end">
                <TouchableOpacity
                  onPress={handleSubmitVideo}
                  disabled={!songTitle.trim() || !artistName.trim()}
                  className={`bg-pink-500 rounded-lg px-6 py-3 ${
                    !songTitle.trim() || !artistName.trim() ? "opacity-50" : ""
                  }`}
                >
                  <Text className="text-white font-semibold text-base">Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default AddVideo;