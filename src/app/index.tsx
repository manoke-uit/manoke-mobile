import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { APP_COLOR } from "../utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AppProvider, { useCurrentApp } from "./context/appContext";
import { getAccountAPI } from "@/utils/api";

const Logo = require("@/assets/auth/Logo/Logo.png");

const WelcomePage = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { setAppState } = useCurrentApp();
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRedirect(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const fetchAccount = async () => {
      const res = await getAccountAPI();
      if (res) {
        setAppState(res);
        router.replace("/(tabs)/home");
      } else {
      }
      fetchAccount();
    };
  }, []);
  if (shouldRedirect) {
    return <Redirect href={"/(auth)/start"} />;
  }

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
};

export default WelcomePage;
