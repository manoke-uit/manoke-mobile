import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { APP_COLOR } from "../utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCurrentApp } from "./context/appContext";
import { getAccountAPI } from "@/utils/api";

const Logo = require("@/assets/auth/Logo/Logo.png");

const WelcomePage = () => {
  const { setAppState } = useCurrentApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await getAccountAPI();
        if (res) {
          setAppState(res);
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(auth)/start");
        }
      } catch (error) {
        router.replace("/(auth)/start");
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={[APP_COLOR.PURPLE, APP_COLOR.PINK]}
        className="flex-1"
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "timing", duration: 2500 }}
          >
            <Image source={Logo} className="w-24 h-24 mb-8" />
          </MotiView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return null;
};

export default WelcomePage;
