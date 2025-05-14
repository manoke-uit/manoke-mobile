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

interface User {
  id: string;
  displayName: string;
  email: string;
}

interface Friend {
  userId_1: string;
  userId_2: string;
  status: "pending" | "accepted" | "rejected";
  user_1: { id: string; displayName: string };
  user_2: { id: string; displayName: string };
}

const FriendsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
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
      return;
    }
    try {
      setIsLoading(true);
      const response = await searchUsersAPI(searchQuery);
      const users = response.items.filter((user: User) =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(users);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to search users. Please try again.",
      });
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

  const renderUserItem = ({ item }: { item: User }) => {
    const isFriend = friends.some(
      (f) => (f.userId_1 === item.id && f.userId_2 === currentUserId) ||
             (f.userId_2 === item.id && f.userId_1 === currentUserId)
    );
    const isPending = pendingRequests.some(
      (f) => f.userId_1 === currentUserId && f.userId_2 === item.id
    );
    return (
      <View className="flex-row items-center justify-between p-3 border-b border-gray-700">
        <View>
          <Text className="text-white font-semibold">{item.displayName}</Text>
          <Text className="text-gray-400 text-sm">{item.email}</Text>
        </View>
        {isFriend ? (
          <Text className="text-green-400">Friend</Text>
        ) : isPending ? (
          <Text className="text-yellow-400">Pending</Text>
        ) : (
          <TouchableOpacity
            onPress={() => handleSendFriendRequest(item.id)}
            className="bg-pink-500 rounded-full px-3 py-1"
          >
            <Text className="text-white text-sm">Add Friend</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPendingRequest = ({ item }: { item: Friend }) => (
    <View className="flex-row items-center justify-between p-3 border-b border-gray-700">
      <Text className="text-white font-semibold">{item.user_1.displayName}</Text>
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => handleRespondToRequest(item.userId_1, "accepted")}
          className="bg-green-500 rounded-full px-3 py-1 mr-2"
        >
          <Text className="text-white text-sm">Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRespondToRequest(item.userId_1, "rejected")}
          className="bg-red-500 rounded-full px-3 py-1"
        >
          <Text className="text-white text-sm">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFriend = ({ item }: { item: Friend }) => {
    const friend = item.userId_1 === currentUserId ? item.user_2 : item.user_1;
    return (
      <View className="flex-row items-center justify-between p-3 border-b border-gray-700">
        <Text className="text-white font-semibold">{friend.displayName}</Text>
        <TouchableOpacity
          onPress={() => handleRemoveFriend(friend.id)}
          className="bg-red-500 rounded-full px-3 py-1"
        >
          <Text className="text-white text-sm">Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <View className="px-4 py-4">
        <Text className="text-white text-2xl font-bold mb-4">Friends</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/10 rounded-lg px-3 py-2 mb-4">
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
            <FlatList
              data={searchResults}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View className="mb-4">
            <Text className="text-white text-lg font-semibold mb-2">Friend Requests</Text>
            <FlatList
              data={pendingRequests}
              renderItem={renderPendingRequest}
              keyExtractor={(item) => `${item.userId_1}-${item.userId_2}`}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Friends List */}
        <Text className="text-white text-lg font-semibold mb-2">Friends List</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={APP_COLOR.PINK} />
        ) : friends.length === 0 ? (
          <Text className="text-gray-400">No friends yet.</Text>
        ) : (
          <FlatList
            data={friends}
            renderItem={renderFriend}
            keyExtractor={(item) => `${item.userId_1}-${item.userId_2}`}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FriendsTab;