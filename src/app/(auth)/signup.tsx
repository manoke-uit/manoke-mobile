import React, { useEffect, useRef, useState } from "react";
import { 
    View, 
    Animated, 
    Dimensions, 
    Image, 
    Text, 
    TextInput, 
    TouchableOpacity 
    } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLOR } from "@/utils/constant";
import tw from "twrnc";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const SignUp = () => {
    const slideAnim = useRef(new Animated.Value(-modalHeight)).current;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleSignUp = async () => {
        
    };

    const isButtonActive = email.length > 0 && password.length > 0;

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
                            Register
                        </Text>
                        <Text style={tw`text-sm text-center mt-2 px-10 text-[${APP_COLOR.TEXT_PURPLE}]`}>
                          Enter your email to receive a passcode.
                        </Text>
                    </View>

                    <View style={tw`w-full items-center mt-10`}>
                        <TextInput
                            placeholder="Email"
                            style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
                            placeholderTextColor={"#66339980"}
                            value={email}
                            onChangeText={setEmail} 
                        />
                        <TouchableOpacity style={tw`mb-5`}>
                            <Text style={tw`text-sm text-center mt-2 font-bold font-underline text-[${APP_COLOR.TEXT_PURPLE}]`}>
                                Send Passcode
                            </Text>
                        </TouchableOpacity>

                        <TextInput
                            placeholder="Passcode"
                            style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 colors-[${APP_COLOR.TEXT_PURPLE}]`}
                            placeholderTextColor={"#66339980"}
                            value={password}
                            onChangeText={setPassword} 
                        />
                    </View>

                    <View style={tw`w-full items-center mt-5`}>
                        <TouchableOpacity
                            onPress={() => router.push("./signup2")} // chưa viết hàm xử lý email
                            style={tw`w-[80%] h-[50px] rounded-lg items-center justify-center ${
                                isButtonActive 
                                    ? `bg-[${APP_COLOR.PURPLE}]` 
                                    : `bg-[${APP_COLOR.LIGHT_PURPLE}]`
                            }`}
                        >
                            <Text style={tw`text-white text-lg font-roboto font-bold`}>Next</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push("./signin")}>
                            <Text style={tw`text-sm text-center mt-3 text-[${APP_COLOR.TEXT_PURPLE}]`}>
                                Already Have An Account? 
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default SignUp;