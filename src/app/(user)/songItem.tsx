import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MoreMenu from "@/components/moreMenu";

const song = [
    { id: "1", name: "Name of Song", artist: "Artist"},
    { id: "2", name: "Name of Song", artist: "Artist"},
    { id: "3", name: "Name of Song", artist: "Artist"},
    { id: "4", name: "Name of Song", artist: "Artist"},
    { id: "5", name: "Name of Song", artist: "Artist"},
    { id: "6", name: "Name of Song", artist: "Artist"},
    { id: "7", name: "Name of Song", artist: "Artist"},
    { id: "8", name: "Name of Song", artist: "Artist"},
]

const songItemScreen = () => {
    const [isMoreMenuVisible, setMoreMenuVisible] = useState<boolean>(false);

    const handleRemoveFromQueue = (): void => {
        console.log("Removed to queue");
      };
    
    const handleAddToFavorite = (): void => {
        console.log("Added to favorite");
    };
    
    const handleAddToPlaylist = (): void => {
        console.log("Added to playlist");
    };
    
    
    return(
        <LinearGradient
            colors={[APP_COLOR.BLACK, APP_COLOR.BLACK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.5]}
            style={{ flex: 1 }}
        >
            {/* Custom Header */}
            <View
                className="w-full flex flex-row"
                style={{
                    paddingVertical: 30,
                    paddingHorizontal: 20,
                    backgroundColor: "transparent",
                }}
            >
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-pink-500/30">
                    <Ionicons name="chevron-back-outline" size={25} color={APP_COLOR.WHITE} />
                </TouchableOpacity>
            </View>
            <View 
                className="w-full"
                style={{
                    height: 250, 
                    backgroundColor: "white",
                    paddingVertical: 30,
                    paddingHorizontal: 20, 
                  }} />
            <View className="w-full px-3 py-5">
                {song.filter(item => item.id === "1").map((item) => (
                    <View key={item.id} className="flex-row items-center mb-5 ml-3">
                    <View className="justify-center">
                        <Text className="text-white font-bold text-2xl">{item.name}</Text>
                        <Text className="text-gray-400 text-xl">{item.artist}</Text>
                    </View>
                    <TouchableOpacity 
                        className="ml-auto px-4 py-2" 
                        onPress={() => setMoreMenuVisible(true)}>
                        <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
                    </TouchableOpacity>
                    </View>
                ))}
            </View>


            <View className=" rounded-2xl px-6 py-6 h-[75vh]">
                    <Text className="text-white font-bold text-2xl">Queue</Text>
                    <ScrollView
                        contentContainerStyle={{
                        paddingBottom: 80,
                        }}
                        className="h-full color-transparent"
                    >
                        <View className=" rounded-2xl py-6 h-[75vh]">
                        {song.map((item) => (
                            <View key={item.id} className="flex-row items-center mb-5">
                                <View className="w-24 h-24 bg-gray-400 rounded-lg mr-4" />
                                    <View className="justify-center">
                                        <Text className="text-white font-bold">{item.name}</Text>
                                        <Text className="text-gray-400">{item.artist}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        className="ml-auto px-4 py-2" 
                                        onPress={() => setMoreMenuVisible(true)}>
                                        <Entypo name="dots-three-vertical" size={20} color="#C0C0C0" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            </View>
                    </ScrollView>
            </View>
 
            {/* More Menu Modal */}
            <MoreMenu
                visible={isMoreMenuVisible}
                onClose={() => setMoreMenuVisible(false)}
                onAddToQueue={() => {}} 
                onRemoveFromQueue={handleRemoveFromQueue} 
                onAddToFavorite={handleAddToFavorite}
                onRemoveFromFavorite={() => {}} 
                onAddToPlaylist={handleAddToPlaylist}
                isFavoriteTab={false}
                isQueueTab={true} 
            />

        </LinearGradient>
    )
}

export default songItemScreen;