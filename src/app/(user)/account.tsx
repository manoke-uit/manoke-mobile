import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AccountPage = () => {
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: "#121212",
      }}
    >
      <View className="flex-row justify-between items-center mb-10">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color="hotpink" />
        </TouchableOpacity>
        <Text className="text-pink-400 text-xl font-bold m-auto">Settings</Text>
        <TouchableOpacity onPress={() => router.replace("/home")}>
          <Text className="text-pink-400 font-bold text-base">Done</Text>
        </TouchableOpacity>
      </View>

      <View className="items-center mb-10">
        <View className="w-20 h-20 rounded-full bg-pink-300 items-center justify-center">
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text className="text-white mt-3 text-lg font-semibold">admin</Text>
      </View>

      <View className="bg-neutral-700 rounded-lg overflow-hidden mb-10">
        <TouchableOpacity
          className="flex-row justify-between items-center px-4 py-4 border-b border-neutral-600"
          onPress={() => router.push("/(user)/changeProfile")}
        >
          <Text className="text-white">Change Profile Image</Text>
          <Entypo name="chevron-right" size={16} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row justify-between items-center px-4 py-4 border-b border-neutral-600"
          onPress={() => router.push("/(user)/changeUsername")}
        >
          <Text className="text-white">Change Username</Text>
          <Entypo name="chevron-right" size={16} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row justify-between items-center px-4 py-4"
          onPress={() => router.push("/(user)/changePassword")}
        >
          <Text className="text-white">Change Password</Text>
          <Entypo name="chevron-right" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="bg-neutral-700 py-3 rounded-xl items-center">
        <Text className="text-red-400 font-bold">Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AccountPage;
