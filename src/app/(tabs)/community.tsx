import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
  TouchableHighlight,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AnimatedWrapper from "@/components/animation/animate";
import { APP_COLOR } from "@/utils/constant";
import { useNavigation, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createPostAPI,
  getPostsAPI,
  deletePostAPI,
  createCommentAPI,
  getFriendsAPI,
  getUserByIdAPI,
  getAllScores,
} from "@/utils/api";

const CommunityTab = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [isMoreMenuVisible, setMoreMenuVisible] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedScore, setSelectedScore] = useState<IScore | null>(null);
  const [scores, setScores] = useState<IScore[]>([]);
  const navigation = useNavigation();
  const router = useRouter();
  const currentOffset = useRef(0);
  const [visible, setVisible] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 150;
  const gradientHeight = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [headerHeight + 100, 10],
    extrapolate: "clamp",
  });
  const userIdRef = useRef<string | null>(null);
  const [audioModalVisible, setAudioModalVisible] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem("accessToken");
        const userId = await AsyncStorage.getItem("userId");
        userIdRef.current = userId;
        if (!token || !userId) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Invalid session. Please log in again.",
          });
          router.replace("/signin");
          return;
        }

        try {
          const res = await getUserByIdAPI(userId);
          setDisplayName(res.displayName || res.data?.displayName || "");
          setImageUrl(res.imageUrl || res.data?.imageUrl || null);
        } catch (e) {
          setDisplayName("");
          setImageUrl(null);
        }

        const friendResponse = await getFriendsAPI();
        const friendIds = friendResponse.map((f: any) =>
          f.userId_1 === userId ? f.userId_2 : f.userId_1
        );
        setFriends(friendIds);

        const postResponse = await getPostsAPI();
        setPosts(postResponse.items || []);

        const scoresResponse = await getAllScores();
        setScores(scoresResponse || []);
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Failed to load data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !selectedScore) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select an audio and write a description.",
      });
      return;
    }
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");
      if (!token || !userId) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid session. Please log in again.",
        });
        router.replace("/signin");
        return;
      }

      await createPostAPI({
        userId,
        description: newPostContent,
        scoreId: selectedScore.id,
        createdAt: new Date().toISOString(),
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Post created successfully.",
      });

      setNewPostContent("");
      setSelectedScore(null);

      const postResponse = await getPostsAPI();
      setPosts(postResponse.items || []);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to create post. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePostAPI(postId);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Post deleted successfully.",
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to delete post.",
      });
    } finally {
      setMoreMenuVisible(null);
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Comment cannot be empty.",
      });
      return;
    }
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid session. Please log in again.",
        });
        router.replace("/signin");
        return;
      }
      await createCommentAPI({ comment: commentText, postId });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Comment added successfully.",
      });
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      const postResponse = await getPostsAPI();
      setPosts(postResponse.items || []);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to add comment.",
      });
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const diff = offsetY - currentOffset.current;
    if (diff > 10 && visible) {
      setVisible(false);
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else if (diff < -10 && !visible) {
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
            <View className="flex-row items-center mb-3 justify-between">
              <View className="flex-row items-center">
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={40}
                    color="#eee"
                    style={{ marginRight: 12 }}
                  />
                )}
                <Text className="text-white font-semibold text-base">{displayName || "You"}</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/friends")}
                style={{ marginLeft: 8 }}>
                <Ionicons
                  name="people-outline"
                  size={28}
                  color={APP_COLOR.WHITE}
                />
              </TouchableOpacity>
            </View>

            {selectedScore && (
              <View className="flex-row items-center bg-white/5 rounded-lg p-2 mb-3">
                <Image
                  source={{ uri: selectedScore.song.imageUrl }}
                  style={{ width: 40, height: 40, borderRadius: 8 }}
                />
                <View className="flex-1 ml-2">
                  <Text className="text-white font-medium">{selectedScore.song.title}</Text>
                  <Text className="text-gray-400 text-sm">Score: {Math.round(selectedScore.finalScore * 100) / 100}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedScore(null)}>
                  <Ionicons name="close-circle" size={24} color="#eee" />
                </TouchableOpacity>
              </View>
            )}

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
                onPress={() => setAudioModalVisible(true)}
                className="mr-3"
              >
                <Ionicons
                  name="musical-notes-outline"
                  size={28}
                  color={APP_COLOR.PURPLE}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreatePost}
                disabled={!newPostContent.trim() || !selectedScore || isLoading}
                className={`bg-pink-500 rounded-full px-5 py-2 ${(!newPostContent.trim() || !selectedScore || isLoading) ? "opacity-50" : ""}`}
              >
                <Text className="text-white font-semibold">Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Audio Selection Modal */}
          <Modal
            visible={audioModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setAudioModalVisible(false)}
          >
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
              <View style={{ backgroundColor: APP_COLOR.BLACK, borderRadius: 10, padding: 20, width: "90%", maxHeight: "80%" }}>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Select Audio from History</Text>
                <ScrollView>
                  {scores.map((score) => (
                    <TouchableHighlight
                      key={score.id}
                      underlayColor={APP_COLOR.LIGHT_PURPLE}
                      onPress={() => {
                        setSelectedScore(score);
                        setAudioModalVisible(false);
                      }}
                      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#333" }}
                    >
                      <View className="flex-row items-center">
                        <Image
                          source={{ uri: score.song.imageUrl }}
                          style={{ width: 50, height: 50, borderRadius: 8 }}
                        />
                        <View className="flex-1 ml-3">
                          <Text style={{ color: "white", fontWeight: "500" }}>{score.song.title}</Text>
                          <Text style={{ color: "#999" }}>Score: {Math.round(score.finalScore * 100) / 100}</Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  ))}
                </ScrollView>
                <TouchableOpacity 
                  onPress={() => setAudioModalVisible(false)}
                  style={{ marginTop: 10, padding: 10, backgroundColor: APP_COLOR.PINK, borderRadius: 8 }}
                >
                  <Text style={{ color: "white", textAlign: "center", fontWeight: "500" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Posts List */}
          {isLoading ? (
            <Text className="text-white text-center">Loading...</Text>
          ) : posts.length === 0 ? (
            <Text className="text-gray-400 text-center">No posts yet.</Text>
          ) : (
            posts.map((post) => (
              <View key={post.id} className="border-b border-white/10 p-4">
                {/* Post Header */}
                <View className="flex-row items-center mb-2">
                  {post.user.imageUrl ? (
                    <Image
                      source={{ uri: post.user.imageUrl }}
                      style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                    />
                  ) : (
                    <Ionicons
                      name="person-circle-outline"
                      size={40}
                      color="#eee"
                      style={{ marginRight: 12 }}
                    />
                  )}
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{post.user.displayName}</Text>
                    <Text className="text-gray-400 text-sm">{post.score.song.title}</Text>
                  </View>
                  {post.userId === userIdRef.current && (
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
                  )}
                </View>

                {/* Post Content */}
                <Text className="text-white text-base mb-3">{post.description}</Text>

                {/* Post Actions */}
                <View className="flex-row items-center mb-3">
                  <TouchableOpacity className="flex-row items-center">
                    <Ionicons
                      name="chatbubble-outline"
                      size={20}
                      color="#eee"
                      className="mr-1"
                    />
                    <Text className="text-gray-400">{post.comments.length}</Text>
                  </TouchableOpacity>
                </View>

                {/* Comments Section */}
                {post.comments.map((comment) => (
                  <View key={comment.id} className="ml-2 mb-2 flex-row items-center">
                    <Ionicons
                      name="person-circle-outline"
                      size={24}
                      color="#eee"
                      className="mr-2"
                    />
                    <View>
                      <Text className="text-white font-semibold text-sm">{comment.user.displayName}</Text>
                      <Text className="text-gray-400 text-sm">{comment.comment}</Text>
                    </View>
                  </View>
                ))}

                {/* Comment Input */}
                <View className="flex-row items-center mt-2">
                  <TextInput
                    placeholder="Write a comment..."
                    placeholderTextColor="#eee"
                    value={newComment[post.id] || ""}
                    onChangeText={(text) =>
                      setNewComment((prev) => ({ ...prev, [post.id]: text }))
                    }
                    className="flex-1 text-white text-sm bg-white/10 rounded-lg px-3 py-1 mr-2"
                  />
                  <TouchableOpacity
                    onPress={() => handleAddComment(post.id)}
                    disabled={!newComment[post.id]?.trim()}
                    className="ml-2"
                  >
                    <Ionicons
                      name="send-sharp"
                      size={24}
                      color={newComment[post.id]?.trim() ? "#f9a8d4" : "#9ca3af"}
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
            ))
          )}
        </Animated.ScrollView>
      </AnimatedWrapper>
    </View>
  );
};

export default CommunityTab;