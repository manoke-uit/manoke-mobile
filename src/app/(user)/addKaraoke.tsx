import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { getSongById, createKaraokeAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import Toast from "react-native-toast-message";

const AddKaraokeScreen = () => {
  const { songId } = useLocalSearchParams();
  const [song, setSong] = useState<ISong | null>(null);
  const [description, setDescription] = useState("");
  const [karaokeFile, setKaraokeFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      if (!songId) {
        Alert.alert("Error", "Song ID not found.");
        router.back();
        return;
      }
      try {
        const songData = await getSongById(songId as string);
        setSong(songData);
      } catch (error) {
        Alert.alert("Error", "Could not load song information.");
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [songId]);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["audio/*", "video/*"], // Allow audio or video files
      });
      if (!result.canceled) {
        setKaraokeFile(result.assets[0]);
      }
    } catch (error) {
      console.error("File picking error:", error);
      Alert.alert("Error", "Could not select the file.");
    }
  };

  const handleSubmit = async () => {
    if (!karaokeFile) {
      Alert.alert("Missing Information", "Please select a karaoke file.");
      return;
    }
    if (!songId) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append("description", description);
    formData.append("songId", songId as string);
    formData.append("file", {
      uri: karaokeFile.uri,
      name: karaokeFile.name,
      type: karaokeFile.mimeType,
    } as any);

    try {
      await createKaraokeAPI(formData);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Your karaoke has been uploaded and is pending review!",
      });
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Upload Failed", "An error occurred during upload.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]} // Updated color
        style={styles.containerCenter}
      >
        <ActivityIndicator size="large" color={APP_COLOR.WHITE} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]} // Updated color
      style={styles.container}
    >
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={APP_COLOR.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contribute a Karaoke</Text>
         <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.songInfo}>
            <Text style={styles.label}>For Song:</Text>
            <Text style={styles.songTitle}>{song?.title}</Text>
            <Text style={styles.artistName}>{song?.artists?.map(a => a.name).join(', ')}</Text>
        </View>

        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., Official beat, male key, etc."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Karaoke File</Text>
        <TouchableOpacity style={styles.filePicker} onPress={handlePickFile}>
          <Ionicons name="cloud-upload-outline" size={24} color={APP_COLOR.PINK} />
          <Text style={styles.filePickerText}>
            {karaokeFile ? karaokeFile.name : "Select audio/video file"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.submitButton, submitting && styles.disabledButton]} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color={APP_COLOR.WHITE} />
          ) : (
            <Text style={styles.submitButtonText}>Upload & Submit for Review</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  containerCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 10 },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  backButton: { padding: 5 },
  formContainer: { padding: 20 },
  songInfo: { marginBottom: 25, padding: 15, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 },
  songTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  artistName: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  label: { color: "rgba(255, 255, 255, 0.8)", fontSize: 16, marginBottom: 10 },
  input: { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 20 },
  filePicker: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.1)", padding: 15, borderRadius: 10, marginBottom: 30 },
  filePickerText: { color: "white", marginLeft: 10, flex: 1 },
  submitButton: { backgroundColor: APP_COLOR.PINK, padding: 18, borderRadius: 30, alignItems: "center" },
  disabledButton: { backgroundColor: '#888' },
  submitButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default AddKaraokeScreen;