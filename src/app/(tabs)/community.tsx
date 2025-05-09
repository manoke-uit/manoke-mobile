import React, { useState, useRef } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AnimatedWrapper from "@/components/animation/animate";
import { APP_COLOR } from "@/utils/constant";
import { useNavigation } from "expo-router";

// Define a type for valid Ionicons names
type IoniconsName = 
  | "person-circle-outline"
  | "musical-notes-outline"
  | "chatbubble-outline"
  | "star-outline";

// Define the avatar type
interface Avatar {
  type: "Ionicons";
  name: IoniconsName;
}

// Define the comment type
interface Comment {
  text: string;
  user: string;
  avatar: Avatar;
}

// Define the post type
interface Post {
  id: string;
  songName: string;
  artist: string;
  user: string;
  content: string;
  avatar: Avatar;
}

const CommunityTab = () => {
  const [isMoreMenuVisible, setMoreMenuVisible] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({}); // Per-post comment input state
  const [activeCommentInput, setActiveCommentInput] = useState<string | null>(null); // Track active input
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [uploadRecording, setUploadRecording] = useState<string>("");
  const navigation = useNavigation();
  const currentOffset = useRef(0);
  const [visible, setVisible] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 150;
  const gradientHeight = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [headerHeight + 100, 10],
    extrapolate: "clamp",
  });

  const posts: Post[] = [
    {
      id: "1",
      songName: "Still Into You",
      artist: "Paramore",
      user: "musiclover",
      content: "This song never gets old! 🎸 #Paramore",
      avatar: { type: "Ionicons", name: "person-circle-outline" },
    },
    {
      id: "2",
      songName: "Die For You",
      artist: "The Weeknd",
      user: "nightvibes",
      content: "Perfect for late-night drives 🌌 #TheWeeknd",
      avatar: { type: "Ionicons", name: "musical-notes-outline" },
    },
    {
      id: "3",
      songName: "Easy On Me",
      artist: "Adele",
      user: "soulfulsounds",
      content: "Adele’s voice is pure magic 😭 #EasyOnMe",
      avatar: { type: "Ionicons", name: "star-outline" },
    },
    {
      id: "4",
      songName: "Easy On Me",
      artist: "Adele",
      user: "soulfulsounds",
      content: "Adele’s voice is pure magic 😭 #EasyOnMe",
      avatar: { type: "Ionicons", name: "person-circle-outline" },
    },
    {
      id: "5",
      songName: "Easy On Me",
      artist: "Adele",
      user: "soulfulsounds",
      content: "Adele’s voice is pure magic 😭 #EasyOnMe",
      avatar: { type: "Ionicons", name: "musical-notes-outline" },
    },
    {
      id: "6",
      songName: "Easy On Me",
      artist: "Adele",
      user: "soulfulsounds",
      content: "Adele’s voice is pure magic 😭 #EasyOnMe",
      avatar: { type: "Ionicons", name: "star-outline" },
    },
    {
      id: "7",
      songName: "Blinding Lights",
      artist: "The Weeknd",
      user: "nightvibes",
      content: "Can’t stop dancing to this! 🕺 #BlindingLights",
      avatar: { type: "Ionicons", name: "musical-notes-outline" },
    },
    {
      id: "8",
      songName: "Rolling in the Deep",
      artist: "Adele",
      user: "soulfulsounds",
      content: "Such a powerful track! 🔥 #Adele",
      avatar: { type: "Ionicons", name: "star-outline" },
    },
    {
      id: "9",
      songName: "Misery Business",
      artist: "Paramore",
      user: "musiclover",
      content: "Brings back all the feels! 🤘 #Paramore",
      avatar: { type: "Ionicons", name: "person-circle-outline" },
    },
    {
      id: "10",
      songName: "Save Your Tears",
      artist: "The Weeknd",
      user: "nightvibes",
      content: "Perfect vibe for tonight 🌃 #TheWeeknd",
      avatar: { type: "Ionicons", name: "musical-notes-outline" },
    },
  ];

  const handleDeletePost = (postId: string): void => {
    console.log(`Deleted post ${postId}`);
    setMoreMenuVisible(null);
  };

  const handleAddComment = (postId: string): void => {
    const commentText = newComments[postId]?.trim();
    if (commentText) {
      setComments((prev) => ({
        ...prev,
        [postId]: [
          ...(prev[postId] || []),
          {
            text: commentText,
            user: "admin",
            avatar: { type: "Ionicons", name: "person-circle-outline" },
          },
        ],
      }));
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
      setActiveCommentInput(null);
    }
  };

  const handleCreatePost = (): void => {
    if (newPostContent.trim()) {
      console.log("New post created:", newPostContent);
      setNewPostContent("");
    }
  };

  const handleUploadRecording = (): void => {
    if (uploadRecording.trim()) {
      console.log("Recording uploaded:", uploadRecording);
      setUploadRecording("");
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const diff = offsetY - currentOffset.current;

    console.log(`OffsetY: ${offsetY}, Diff: ${diff}, Visible: ${visible}`);

    if (diff > 10 && visible) {
      console.log("Hiding tab bar");
      setVisible(false);
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else if (diff < -10 && !visible) {
      console.log("Showing tab bar");
      setVisible(true);
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          height: 70,
        },
      });
    }

    currentOffset.current = offsetY;
  };

  return (
    <View style={{ flex: 1, backgroundColor: APP_COLOR.BLACK }}>
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: gradientHeight,
            zIndex: 0,
          }}
        >
          <LinearGradient
            colors={[APP_COLOR.LIGHT_PINK, APP_COLOR.BLACK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 1]}
            style={{ flex: 1 }}
          />
        </Animated.View>

        <Animated.ScrollView
          className="flex-1"
          onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
            scrollY.setValue(event.nativeEvent.contentOffset.y);
            handleScroll(event);
          }}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* New Post Input */}
          <View className="px-4 py-4 bg-white/10 rounded-xl mx-4 mt-8 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="person-circle-outline"
                size={40}
                color="#eee"
                className="mr-3"
              />
              <Text className="text-white font-semibold text-base">Admin</Text>
            </View>
            <TextInput
              placeholder="Share a song..."
              placeholderTextColor="#eee"
              value={newPostContent}
              onChangeText={setNewPostContent}
              className="text-white text-base bg-white/5 rounded-lg px-3 py-2 mb-3"
              multiline
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => {handleUploadRecording(); setUploadRecording("");}}
                className="mr-3"
              > 
                <Ionicons
                  name="document"
                  size={28}
                  color={APP_COLOR.PINK}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreatePost}
                disabled={!newPostContent.trim()}
                className={`bg-pink-500 rounded-full px-5 py-2 ${!newPostContent.trim() ? "opacity-50" : ""}`}
              >
                <Text className="text-white font-semibold">Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Posts List */}
          {posts.map((post) => (
            <View key={post.id} className="border-b border-white/10 p-10">
              {/* Post Header */}
              <View className="flex-row items-center mb-2">
                {post.avatar.type === "Ionicons" ? (
                  <Ionicons
                    name={post.avatar.name}
                    size={40}
                    color="#eee"
                    className="mr-3"
                  />
                ) : (
                  <View className="w-10 h-10 rounded-full mr-3 bg-gray-400" />
                )}
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-white font-semibold">{post.user}</Text>
                  </View>
                  <Text className="text-gray-400 text-sm">
                    {post.songName} by {post.artist}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setMoreMenuVisible(post.id)}
                  className="p-2"
                >
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={20}
                    color="#eee"
                  />
                </TouchableOpacity>
              </View>

              {/* Post Content */}
              <Text className="text-white text-base mb-3">{post.content}</Text>

              {/* Post Actions */}
              <View className="flex-row items-center mb-3">
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons
                    name="chatbubble-outline"
                    size={20}
                    color="#eee"
                    className="mr-1"
                  />
                  <Text className="text-gray-400">{(comments[post.id] || []).length}</Text>
                </TouchableOpacity>
              </View>

              {/* Comments Section */}
              {(comments[post.id] || []).map((comment, index) => (
                <View key={index} className="ml-2 mb-4 flex-row items-center">
                  {comment.avatar.type === "Ionicons" && (
                    <Ionicons
                      name={comment.avatar.name}
                      size={24}
                      color="#eee"
                      className="mr-2"
                    />
                  )}
                  <View>
                    <Text className="text-white font-semibold text-sm">{comment.user}</Text>
                    <Text className="text-gray-400 text-sm">{comment.text}</Text>
                  </View>
                </View>
              ))}

              {/* Comment Input */}
              <View className="flex-row items-center mt-2 py-3">
                <TextInput
                  placeholder="Reply..."
                  placeholderTextColor="#eee"
                  value={newComments[post.id] || ""}
                  onChangeText={(text) =>
                    setNewComments((prev) => ({ ...prev, [post.id]: text }))
                  }
                  onFocus={() => setActiveCommentInput(post.id)}
                  onBlur={() => setActiveCommentInput(null)}
                  editable={activeCommentInput === null || activeCommentInput === post.id}
                  className={`flex-1 text-white text-sm bg-white/10 rounded-lg px-3 py-1 mr-2 ${
                    activeCommentInput !== null && activeCommentInput !== post.id ? "opacity-50" : ""
                  }`}
                />
                <TouchableOpacity
                  onPress={() => handleAddComment(post.id)}
                  disabled={!newComments[post.id]?.trim()}
                  className="ml-2"
                >
                  <Ionicons
                    name="send-sharp"
                    size={24}
                    color={newComments[post.id]?.trim() ? "#f9a8d4" : "#9ca3af"} 
                    style={{ transform: [{ rotate: "-45deg" }] }}
                  />
                </TouchableOpacity>
              </View>

              {/* More Menu */}
              {isMoreMenuVisible === post.id && (
                <View className="absolute right-4 top-10 bg-white/20 rounded-lg border border-white/10">
                  <TouchableOpacity
                    onPress={() => handleDeletePost(post.id)}
                    className="px-4 py-2"
                  >
                    <Text className="text-pink-300">Delete Post</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </Animated.ScrollView>
      </AnimatedWrapper>
    </View>
  );
};

export default CommunityTab;