import React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import ShareButton from "../components/button/share.button";
import { APP_COLOR } from "../utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Redirect } from "expo-router";
const bg = require("@/assets/auth/welcome-background.png");
const fbLogo = require("@/assets/auth/facebook.png");
const ggLogo = require("@/assets/auth/google.png");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeText: {
    flex: 0.6,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 20,
  },
  welcomeBtn: { flex: 0.4, gap: 20 },
  heading: { fontSize: 40, fontWeight: "600" },
  body: { fontSize: 30, color: APP_COLOR.ORANGE, marginVertical: 10 },
  footer: {},
  btnContainer: {},
  btnContent: {
    backgroundColor: "green",
    padding: 20,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  btnText: {
    textTransform: "uppercase",
  },
});
const WelcomePage = () => {
  if (true) {
    <Redirect href={"/(auth)/signup"} />;
  }
  return (
    <ImageBackground style={{ flex: 1 }} source={bg}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={["transparent", "rgba(0,0,0,0.8)"]}
      >
        <View style={styles.container}>
          <View style={styles.welcomeText}>
            <Text style={styles.heading}>WelcomeTo</Text>
            <Text style={styles.body}>July</Text>
            <Text style={styles.footer}>Nen tang giao do vip nhat vn</Text>
          </View>
          <View style={styles.welcomeBtn}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBlockColor: "red",
                marginHorizontal: 50,
              }}
            >
              <Text
                style={{
                  backgroundColor: "white",
                  textAlign: "center",
                  alignSelf: "center",
                  position: "relative",
                  top: 20,
                  padding: 10,
                }}
              >
                {" "}
                Dang nhap voi
              </Text>
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 30,
                }}
              >
                <ShareButton
                  title="facebook"
                  onPress={() => {
                    alert("me");
                  }}
                  textStyle={{ textTransform: "uppercase" }}
                  pressStyle={{ alignSelf: "stretch" }}
                  btnStyle={{
                    justifyContent: "center",
                    borderRadius: 30,
                    backgroundColor: "#fff",
                  }}
                  icon={<Image source={fbLogo} />}
                />
                <ShareButton
                  title="google"
                  onPress={() => {
                    alert("me");
                  }}
                  textStyle={{ textTransform: "uppercase" }}
                  pressStyle={{ alignSelf: "stretch" }}
                  btnStyle={{
                    justifyContent: "center",
                    borderRadius: 30,
                    backgroundColor: "#fff",
                  }}
                  icon={<Image source={ggLogo} />}
                />
              </View>
              <View>
                <ShareButton
                  title="Dang nhap voi email"
                  onPress={() => {
                    alert("me");
                  }}
                  textStyle={{ color: "#fff", paddingVertical: 5 }}
                  pressStyle={{ alignSelf: "stretch" }}
                  btnStyle={{
                    justifyContent: "center",
                    borderRadius: 30,
                    marginHorizontal: 50,
                    paddingVertical: 10,
                    backgroundColor: "#2c2c2c",
                  }}
                />
              </View>
            </View>

            <View>
              <Text style={{ textAlign: "center", color: "white" }}>
                Chua co tai khoan?
              </Text>
              <Link href={"/(auth)/signup"}>
                <Text style={{ textAlign: "center", color: "white" }}>
                  {" "}
                  Dang ky
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default WelcomePage;
