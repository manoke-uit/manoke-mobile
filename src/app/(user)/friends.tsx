import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import tw from "twrnc";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  searchUsersAPI,
  createFriendRequestAPI,
  updateFriendRequestAPI,
  getFriendsAPI,
  getFriendRequestsAPI,
  removeFriendAPI,
} from "@/utils/api";
import { LinearGradient } from "expo-linear-gradient";

const FriendsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<IFriend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("accessToken");
        if (!userId || !token) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Invalid session. Please log in again.",
          });
          router.replace("/signin");
          return;
        }
        setCurrentUserId(userId);
        await Promise.all([fetchFriends(), fetchPendingRequests()]);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load data. Please try again.",
        });
      }
    };
    loadInitialData();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await getFriendsAPI();
      setFriends(response);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to load friends list.",
      });
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await getFriendRequestsAPI();
      setPendingRequests(response);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to load friend requests.",
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    try {
      setIsLoading(true);
      setHasSearched(true);
      const response = await searchUsersAPI(searchQuery.trim());
      if (response.data.data) {
        setSearchResults([response.data.data]);
      } else {
        setSearchResults([]);
      }
    } catch (error: any) {
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFriendRequest = async (receiverId: string) => {
    try {
      await createFriendRequestAPI(receiverId);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Friend request sent successfully.",
      });
      fetchPendingRequests();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to send friend request.",
      });
    }
  };

  const handleRespondToRequest = async (receiverId: string, status: "accepted" | "rejected") => {
    try {
      await updateFriendRequestAPI(receiverId, status);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Friend request ${status === "accepted" ? "accepted" : "rejected"} successfully.`,
      });
      fetchPendingRequests();
      if (status === "accepted") {
        fetchFriends();
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to process friend request.",
      });
    }
  };

  const handleRemoveFriend = async (idToRemove: string) => {
    try {
      await removeFriendAPI(idToRemove);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Friend removed successfully.",
      });
      fetchFriends();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to remove friend.",
      });
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
      <SafeAreaView style={tw`flex-1 bg-transparent`}>
        <View style={{ paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 12, padding: 4 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-back-outline" size={28} color="white" />
            </TouchableOpacity>
            <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", flex: 1, textAlign: 'center' }}>
              Friends
            </Text>
            <View style={{ width: 28, marginLeft: 12 }} />
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-white/20 rounded-xl px-4 py-2 mb-4">
            <Ionicons name="search" size={20} color="#eee" />
            <TextInput
              placeholder="Search users..."
              placeholderTextColor="#eee"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              className="flex-1 text-white ml-2"
            />
          </View>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <View className="mb-4">
              <Text className="text-white text-lg font-semibold mb-2">Search Results</Text>
              {searchResults.map((item) => (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                >
                  <View>
                    <Text className="text-white font-semibold text-base">{item.displayName}</Text>
                    <Text className="text-gray-400 text-sm">{item.email}</Text>
                  </View>
                  {friends.some(
                    (f) => (f.userId_1 === item.id && f.userId_2 === currentUserId) ||
                           (f.userId_2 === item.id && f.userId_1 === currentUserId)
                  ) ? (
                    <Text className="text-green-400 font-semibold">Friend</Text>
                  ) : pendingRequests.some(
                    (f) => f.userId_1 === currentUserId && f.userId_2 === item.id
                  ) ? (
                    <Text className="text-yellow-400 font-semibold">Pending</Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleSendFriendRequest(item.id)}
                      style={{
                        backgroundColor: APP_COLOR.PINK,
                        borderRadius: 20,
                        paddingVertical: 6,
                        paddingHorizontal: 16,
                      }}
                    >
                      <Text className="text-white text-sm font-semibold">Add Friend</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Empty State khi không tìm thấy user */}
          {hasSearched && searchResults.length === 0 && !isLoading && (
            <View className="mb-4 items-center">
              <Ionicons name="person-outline" size={48} color="#aaa" style={{ marginBottom: 8 }} />
              <Text style={{ color: "#aaa", fontSize: 16 }}>
                Can't find user with this email.
              </Text>
            </View>
          )}

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <View className="mb-4">
              <Text className="text-white text-lg font-semibold mb-2">Friend Requests</Text>
              {pendingRequests.map((item) => (
                <View
                  key={`${item.userId_1}-${item.userId_2}`}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                >
                  <Text className="text-white font-semibold text-base">{item.user_1.displayName}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onPress={() => handleRespondToRequest(item.userId_1, "accepted")}
                      style={{
                        backgroundColor: APP_COLOR.PURPLE,
                        borderRadius: 20,
                        paddingVertical: 6,
                        paddingHorizontal: 16,
                        marginRight: 8,
                      }}
                    >
                      <Text className="text-white text-sm font-semibold">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRespondToRequest(item.userId_1, "rejected")}
                      style={{
                        backgroundColor: APP_COLOR.PINK,
                        borderRadius: 20,
                        paddingVertical: 6,
                        paddingHorizontal: 16,
                      }}
                    >
                      <Text className="text-white text-sm font-semibold">Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Friends List */}
          <Text className="text-white text-lg font-semibold mb-2">Friends List</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={APP_COLOR.PINK} />
          ) : friends.length === 0 ? (
            <Text className="text-gray-400">No friends yet.</Text>
          ) : (
            friends.map((item) => {
              const friend = item.userId_1 === currentUserId ? item.user_2 : item.user_1;
              return (
                <View
                  key={`${item.userId_1}-${item.userId_2}`}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                >
                  <Text className="text-white font-semibold text-base">{friend.displayName}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveFriend(friend.id)}
                    style={{
                      backgroundColor: APP_COLOR.PINK,
                      borderRadius: 20,
                      paddingVertical: 6,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text className="text-white text-sm font-semibold">Remove</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FriendsTab;