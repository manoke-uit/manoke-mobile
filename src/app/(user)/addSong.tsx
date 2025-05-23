import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { createSongAPI, createKaraokeAPI } from "@/utils/api";

interface VideoAsset {
  uri: string;
  name: string;
  mimeType: string;
}

interface AudioAsset {
  uri: string;
  name: string;
  mimeType: string;
}

interface ImageAsset {
  uri: string;
  name: string;
  mimeType: string;
}

const AddVideo = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [status, setStatus] = useState<"public" | "private">("private");
  const [selectedVideo, setSelectedVideo] = useState<VideoAsset | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<AudioAsset | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);

  const handleUploadVideo = async () => {
    setUploading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setSelectedVideo({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          mimeType: result.assets[0].mimeType || 'video/mp4'
        });
        setUploadSuccess(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload video. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setSelectedAudio({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          mimeType: result.assets[0].mimeType || 'audio/mp3'
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload audio. Please try again.");
    }
  };

  const handleUploadImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setSelectedImage({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          mimeType: result.assets[0].mimeType || 'image/jpeg'
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload image. Please try again.");
    }
  };

  const handleSubmitVideo = async () => {
    if (!songTitle.trim() || !artistName.trim() || !selectedVideo || !selectedAudio || !selectedImage) {
      Alert.alert("Error", "Please fill in all fields and select all required files");
      return;
    }

    setUploading(true);
    try {
      // First create the song
      const songFormData = new FormData();
      songFormData.append("title", songTitle);
      songFormData.append("lyrics", lyrics || `${songTitle} - ${artistName}`);
      songFormData.append("audio", {
        uri: selectedAudio.uri,
        name: selectedAudio.name,
        type: selectedAudio.mimeType,
      } as any);
      songFormData.append("image", {
        uri: selectedImage.uri,
        name: selectedImage.name,
        type: selectedImage.mimeType,
      } as any);

      const songResponse = await createSongAPI(songFormData);
      
      if (!songResponse.data) {
        throw new Error("Failed to create song");
      }

      // Then create the karaoke with the song ID
      const karaokeFormData = new FormData();
      karaokeFormData.append("description", `${songTitle} - ${artistName}`);
      karaokeFormData.append("songId", songResponse.data.id);
      karaokeFormData.append("file", {
        uri: selectedVideo.uri,
        name: selectedVideo.name,
        type: selectedVideo.mimeType,
      } as any);

      const karaokeResponse = await createKaraokeAPI(karaokeFormData);
      
      if (karaokeResponse.data) {
        Alert.alert("Success", "Video uploaded successfully!");
        setSongTitle("");
        setArtistName("");
        setLyrics("");
        setUploadSuccess(false);
        setSelectedVideo(null);
        setSelectedAudio(null);
        setSelectedImage(null);
        setStatus("private");
        router.replace("/yourSong");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit video. Please try again.");
    } finally {
      setUploading(false);
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
            <Ionicons
              name="chevron-back-outline"
              size={25}
              color={APP_COLOR.WHITE}
            />
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
              <Ionicons
                name="videocam-outline"
                size={40}
                color={APP_COLOR.WHITE}
                className="mr-3"
              />
              <Text className="text-white font-semibold text-lg">
                Upload Files
              </Text>
            </View>
            
            {/* Video Upload */}
            <TouchableOpacity
              onPress={handleUploadVideo}
              disabled={uploading || uploadSuccess}
              className={`bg-pink-500 rounded-lg px-6 py-3 flex-row items-center justify-center mb-4 ${
                uploading || uploadSuccess ? "opacity-50" : ""
              }`}
            >
              {uploading ? (
                <ActivityIndicator
                  size="small"
                  color={APP_COLOR.WHITE}
                  className="mr-2"
                />
              ) : (
                <Ionicons
                  name="film-outline"
                  size={20}
                  color={APP_COLOR.WHITE}
                  className="mr-2"
                />
              )}
              <Text className="text-white font-semibold text-base">
                {uploading
                  ? "Uploading..."
                  : selectedVideo
                  ? "Video Selected"
                  : "Upload Video"}
              </Text>
            </TouchableOpacity>

            {/* Audio Upload */}
            <TouchableOpacity
              onPress={handleUploadAudio}
              className="bg-pink-500 rounded-lg px-6 py-3 flex-row items-center justify-center mb-4"
            >
              <Ionicons
                name="musical-notes-outline"
                size={20}
                color={APP_COLOR.WHITE}
                className="mr-2"
              />
              <Text className="text-white font-semibold text-base">
                {selectedAudio ? "Audio Selected" : "Upload Audio"}
              </Text>
            </TouchableOpacity>

            {/* Image Upload */}
            <TouchableOpacity
              onPress={handleUploadImage}
              className="bg-pink-500 rounded-lg px-6 py-3 flex-row items-center justify-center"
            >
              <Ionicons
                name="image-outline"
                size={20}
                color={APP_COLOR.WHITE}
                className="mr-2"
              />
              <Text className="text-white font-semibold text-base">
                {selectedImage ? "Image Selected" : "Upload Image"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Song Details Input */}
          {uploadSuccess && (
            <View className="bg-white/10 rounded-xl p-6 mb-6">
              <View className="flex-row items-center mb-4">
                <Ionicons
                  name="pencil-outline"
                  size={30}
                  color={APP_COLOR.WHITE}
                  className="mr-3"
                />
                <Text className="text-white font-semibold text-lg">
                  Song Details
                </Text>
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
              <TextInput
                placeholder="Lyrics (optional)"
                placeholderTextColor="#eee"
                value={lyrics}
                onChangeText={setLyrics}
                multiline
                numberOfLines={4}
                className="text-white text-base bg-white/5 rounded-lg px-4 py-3 mb-4"
              />
              <View className="flex-row mb-4">
                <TouchableOpacity
                  onPress={() => setStatus("private")}
                  className={`flex-1 rounded-lg py-3 mr-2 ${
                    status === "private" ? "bg-pink-500" : "bg-white/10"
                  }`}
                >
                  <Text className="text-white text-center font-semibold">
                    Private
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setStatus("public")}
                  className={`flex-1 rounded-lg py-3 ml-2 ${
                    status === "public" ? "bg-pink-500" : "bg-white/10"
                  }`}
                >
                  <Text className="text-white text-center font-semibold">
                    Public
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-end">
                <TouchableOpacity
                  onPress={handleSubmitVideo}
                  disabled={!songTitle.trim() || !artistName.trim() || !selectedVideo || !selectedAudio || !selectedImage}
                  className={`bg-pink-500 rounded-lg px-6 py-3 ${
                    !songTitle.trim() || !artistName.trim() || !selectedVideo || !selectedAudio || !selectedImage ? "opacity-50" : ""
                  }`}
                >
                  <Text className="text-white font-semibold text-base">
                    Submit
                  </Text>
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
