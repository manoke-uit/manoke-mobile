import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Dimensions, Image, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLOR } from "@/utils/constant";
import { useRouter } from "expo-router";
import axios, { AxiosError } from "axios";
import tw from "twrnc";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const SignIn = () => {
    const slideAnim = useRef(new Animated.Value(-modalHeight)).current;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const isButtonActive = username.length > 0 && password.length > 0;

    const handleSignIn = async () => {
        try {
            const response = await axios.post("", { // Fill in the correct URL for API
                username,
                password,
            });
            Alert.alert("Success", "Logged in successfully!");
            router.push("/home");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                const errorData = axiosError.response?.data as { message?: string }; 
                Alert.alert(
                    "Error",
                    errorData?.message || "Invalid username or password."
                );
            } else {
                Alert.alert("Error", "Something went wrong.");
            }
        }
    };

    return (
        <SafeAreaView style={tw`flex-1`}>
            <LinearGradient
                colors={[APP_COLOR.DARK_PURPLE, APP_COLOR.BLACK, APP_COLOR.DARK_PURPLE]}
                style={tw`flex-1`}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.5, 1]}
            >
                <Animated.View
                    style={[
                        {
                            position: "absolute",
                            width: "100%",
                            height: modalHeight,
                            backgroundColor: "#F3F2F8",
                            bottom: slideAnim,
                            left: 0,
                        },
                        tw`rounded-t-3xl items-center justify-start`,
                    ]}
                >
                    <View style={tw`w-full items-center mt-10`}>
                        <Image source={avatar} style={tw`mt-5 mb-5`} />
                        <Text style={tw`font-roboto text-2xl font-bold text-center text-[${APP_COLOR.TEXT_PURPLE}]`}>
                            Login
                        </Text>
                        <Text style={tw`text-sm text-center mt-2 px-10 text-[${APP_COLOR.TEXT_PURPLE}]`}>
                            Enter the username and password you used when you created your account to log in.
                        </Text>
                    </View>

                    <View style={tw`w-full items-center mt-10`}>
                        <TextInput
                            placeholder="Username"
                            style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
                            placeholderTextColor={"#66339980"}
                            value={username}
                            onChangeText={setUsername} 
                        />
                        <TextInput
                            placeholder="Password"
                            secureTextEntry={true}
                            style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
                            placeholderTextColor={"#66339980"}
                            value={password}
                            onChangeText={setPassword} 
                        />
                        <TouchableOpacity>
                            <Text style={tw`text-sm text-center mt-2 text-[${APP_COLOR.TEXT_PURPLE}]`}>
                                Password Lost?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={tw`w-full items-center mt-10`}>
                        <TouchableOpacity
                            style={tw`w-[80%] h-[50px] rounded-lg items-center justify-center ${
                                isButtonActive 
                                    ? `bg-[${APP_COLOR.PURPLE}]` 
                                    : `bg-[${APP_COLOR.LIGHT_PURPLE}]`
                            }`}
                        >
                            <Text style={tw`text-white text-lg font-roboto font-bold`}>Sign In</Text>
                        </TouchableOpacity>
                        {/* Nhớ sửa thành handleSignIn */}
                        <TouchableOpacity onPress={() => router.push("/signup")}> 
                            <Text style={tw`text-sm text-center mt-2 text-[${APP_COLOR.TEXT_PURPLE}]`}>
                                No Manoke Account?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default SignIn;