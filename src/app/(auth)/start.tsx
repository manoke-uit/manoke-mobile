import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLOR } from "@/utils/constant";
import { Redirect } from "expo-router";
import tw from "twrnc"; 

const Logo = require("@/assets/auth/Logo/Manoke.png");
const im1 = require("@/assets/auth/Image/im1.jpg");
const im2 = require("@/assets/auth/Image/im2.jpg");
const im3 = require("@/assets/auth/Image/im3.jpg");
const im4 = require("@/assets/auth/Image/im4.jpg");

const LoginPage = () => {
  const [redirectToSignIn, setRedirectToSignIn] = React.useState(false);
  const [redirectToSignUp, setRedirectToSignUp] = React.useState(false);

  if (redirectToSignIn) {
    return <Redirect href="/(auth)/signin" />;
  }

  if (redirectToSignUp) {
    return <Redirect href="/(auth)/signup" />;
  }

  return (
    <SafeAreaView style={tw`flex-1 flex-row justify-center`}>
      <LinearGradient
        colors={[APP_COLOR.DARK_PURPLE, APP_COLOR.BLACK, APP_COLOR.DARK_PURPLE]}
        style={tw`flex-1 justify-center`}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.5, 1]}
      >
        <View style={tw`flex-1 items-center p-[91px]`}>
          <LinearGradient
            colors={[APP_COLOR.PURPLE, APP_COLOR.PINK]}
            style={tw`w-[247px] h-[169px] justify-center items-center`}
          >
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "timing", duration: 2500 }}
            >
              <Image source={Logo} />
            </MotiView>
          </LinearGradient>
        </View>

        <View style={tw`absolute top-[70px] left-[40px] w-[74px] h-[74px] rounded-[10px]`}>
          <MotiView
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ type: "timing", duration: 1500, loop: true }}
          >
            <Image source={im1} style={tw`w-[74px] h-[74px] rounded-[10px]`} />
          </MotiView>
        </View>

        <View style={tw`absolute top-[75px] right-[50px] w-[61px] h-[61px] rounded-[10px]`}>
          <MotiView
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ type: "timing", duration: 1500, loop: true }}
          >
            <Image source={im2} style={tw`w-[61px] h-[61px] rounded-[10px]`} />
          </MotiView>
        </View>

        <View style={tw`absolute top-[200px] left-[20px] w-[100px] h-[100px] rounded-[10px]`}>
          <MotiView
            animate={{ scale: [1, 0.8, 1] }}
            transition={{ type: "timing", duration: 1500, loop: true }}
          >
            <Image source={im3} style={tw`w-[100px] h-[100px] rounded-[10px]`} />
          </MotiView>
        </View>

        <View style={tw`absolute top-[220px] right-[40px] w-[74px] h-[74px] rounded-[10px]`}>
          <MotiView
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ type: "timing", duration: 1500, loop: true }}
          >
            <Image source={im4} style={tw`w-[74px] h-[74px] rounded-[10px]`} />
          </MotiView>
        </View>

        <View style={tw`absolute top-[270px] left-[20px] p-[50px] justify-center items-center w-[90%]`}>
          <Text style={tw`text-white text-[22px] font-bold text-center mt-5 font-roboto`}>
            Can't stop singing.
          </Text>
          <Text style={tw`text-white text-[17px] text-center mt-5 font-roboto w-[300px]`}>
            Explore a vast catalog of songs, with new tracks added daily to update your playlist with the latest hits.
          </Text>
        </View>

        <View style={tw`absolute bottom-[170px] left-[20px] w-[90%] items-center`}>
          <TouchableOpacity 
            style={tw`bg-[${APP_COLOR.PINK}] rounded-[10px] py-[15px] px-[30px] w-[70%] items-center`}
            onPress={() => setRedirectToSignUp(true)}
          >
            <Text style={tw`text-white text-[22px] font-bold font-roboto`}>
              Sign Up
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={tw`bg-[${APP_COLOR.PURPLE}] rounded-[10px] py-[15px] px-[30px] w-[70%] items-center mt-5`}
            onPress={() => setRedirectToSignIn(true)}
          >
            <Text style={tw`text-white text-[22px] font-bold font-roboto`}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginPage; 