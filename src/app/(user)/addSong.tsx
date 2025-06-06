import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal, // THAY ĐỔI: Sử dụng lại Modal
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { createKaraokeAPI, searchSongsByTitleAPI } from "@/utils/api";

interface VideoAsset {
  uri: string;
  name: string;
  mimeType: string;
}

interface ISong {
  id: string;
  title: string;
  artist: {
    name: string;
  };
}

const AddVideo = () => {
  const [description, setDescription] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<ISong[]>([]);
  const [selectedSong, setSelectedSong] = useState<ISong | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingSongs, setLoadingSongs] = useState(false);
  
  // THAY ĐỔI: Mang state và logic của Modal trở lại
  const [isSongPickerVisible, setSongPickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Logic debounce này giờ sẽ phục vụ cho ô tìm kiếm bên trong Modal
    if (!isSongPickerVisible) return; // Chỉ chạy khi modal được mở

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    if (searchQuery.trim() === "") {
      setFilteredSongs([]);
      setLoadingSongs(false);
      return;
    }

    setLoadingSongs(true);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await searchSongsByTitleAPI(searchQuery);
        if (response.data) {
          setFilteredSongs(response.data);
        } else {
          setFilteredSongs([]);
        }
      } catch (error) {
        console.error("Failed to search songs:", error);
        setFilteredSongs([]);
      } finally {
        setLoadingSongs(false);
      }
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery, isSongPickerVisible]);

  const handleUploadVideo = async () => {
    // ... logic không đổi
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        setSelectedVideo({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          mimeType: result.assets[0].mimeType || 'video/mp4',
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select video. Please try again.");
    }
  };

  const handleSubmitKaraoke = async () => {
    // ... logic không đổi
    if (!description.trim() || !selectedSong || !selectedVideo) {
      Alert.alert("Missing Information", "Please provide a description, select a song, and upload a video.");
      return;
    }
    setUploading(true);
    try {
      const karaokeFormData = new FormData();
      karaokeFormData.append("description", description);
      karaokeFormData.append("songId", selectedSong.id);
      karaokeFormData.append("file", {
        uri: selectedVideo.uri,
        name: selectedVideo.name,
        type: selectedVideo.mimeType,
      } as any);

      const karaokeResponse = await createKaraokeAPI(karaokeFormData);
      if (karaokeResponse.data) {
        Alert.alert("Success", "Karaoke video uploaded successfully!");
        router.back();
      }
    } catch (error: any) {
      Alert.alert("Upload Failed", error.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSelectSong = (song: ISong) => {
    setSelectedSong(song);
    closeModal(); // Đóng modal và reset state
  };

  const openModal = () => {
    setSongPickerVisible(true);
  }

  const closeModal = () => {
    setSongPickerVisible(false);
    setSearchQuery("");
    setFilteredSongs([]);
  }
  
  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.4]}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back-outline" size={25} color={APP_COLOR.WHITE}/>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Upload Karaoke</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Karaoke Details</Text>
            
            <TextInput
              placeholder="Enter a description for your video..."
              placeholderTextColor="#ccc"
              value={description}
              onChangeText={setDescription}
              multiline
              style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
            />

            {/* THAY ĐỔI: Nút bấm kiểu Dropdown */}
            <TouchableOpacity onPress={openModal} style={styles.dropdownButton}>
              <Text style={styles.dropdownText} numberOfLines={1}>
                {selectedSong ? selectedSong.title : "Select a song..."}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleUploadVideo} style={styles.uploadButton}>
              <Ionicons name="videocam-outline" size={20} color={APP_COLOR.WHITE} style={{ marginRight: 10 }} />
              <Text style={styles.buttonText} numberOfLines={1}>
                {selectedVideo ? `Video: ${selectedVideo.name}` : "Upload a karaoke video"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSubmitKaraoke}
            disabled={uploading || !description || !selectedSong || !selectedVideo}
            style={[styles.submitButton, (uploading || !description || !selectedSong || !selectedVideo) && styles.disabledButton]}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={APP_COLOR.WHITE} />
            ) : (
              <Text style={styles.buttonText}>Submit Karaoke</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* THAY ĐỔI: Modal để tìm kiếm và chọn bài hát */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSongPickerVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Song</Text>
            <TextInput
              placeholder="Search by title or artist..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchBar}
            />
            {loadingSongs ? (
              <ActivityIndicator size="large" color={APP_COLOR.PINK} style={{marginTop: 20}} />
            ) : (
              <FlatList
                data={filteredSongs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectSong(item)} style={styles.songItem}>
                    <View>
                      <Text style={styles.songTitle}>{item.title}</Text>
                      <Text style={styles.songArtist}>{item.artist?.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>
                    {searchQuery.trim() !== '' ? 'No songs found.' : 'Type to start searching.'}
                  </Text>
                }
              />
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(236, 72, 153, 0.3)',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  formSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  // THAY ĐỔI: Style cho nút dropdown
  dropdownButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  uploadButton: {
    backgroundColor: APP_COLOR.PINK,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: APP_COLOR.PURPLE, 
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  // THAY ĐỔI: Styles cho Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#2d3748', 
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  songItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  songTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  songArtist: {
    color: '#a0aec0',
    fontSize: 14,
  },
  emptyListText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: APP_COLOR.PINK,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  }
});

export default AddVideo;