// import React from "react";
// import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { APP_COLOR } from "@/utils/constant";
// import AnimatedWrapper from "@/components/animation/animate";
// import tw from "twrnc";

// const HomeTab = () => {
//   return (
//     <LinearGradient
//       colors={[APP_COLOR.LT_PINK, APP_COLOR.BLACK]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0, y: 1 }}
//       locations={[0, 0.5]}
//       style={{ flex: 1 }}
//     >
//       <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
//         <ScrollView className="flex-1 px-4">
//           <View className="pt-8">
//                 <LinearGradient
//                     colors={[APP_COLOR.PINK, APP_COLOR.PURPLE]}
//                     style={tw`w-full h-[150px] justify-center items-center rounded-[10px]`}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                 >
//                     <Text className="flex text-white font-bold text-2xl absolute left-5 top-5">
//                         Sing without limits
//                     </Text>
//                     <Text className="flex text-white pt-7 mx-5 text-[18px]">
//                         Subscribes to unlock full versions of the songs and premium features!
//                     </Text> 
//                 </LinearGradient>

//             <View className="mb-6 pt-8">
//               <View className="flex-row justify-between items-center mb-3">
//                 <Text className="text-white text-2xl font-bold">Playlists</Text>
//                 <TouchableOpacity>
//                   <Text style={tw`text-[${APP_COLOR.PINK}] font-bold text-xl`}>See All</Text>
//                 </TouchableOpacity>
//               </View>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 className="flex-row pt-3"
//               >
//                 {[...Array(5)].map((_, i) => (
//                   <View
//                     key={i}
//                     className="w-[100px] h-[100px] bg-neutral-300  rounded-xl mr-3"
//                   />
//                 ))}
//               </ScrollView>
//             </View>

//             <View className="mb-6 mt-7">
//               <View className="flex-row justify-between items-center mb-3">
//                 <Text className="text-white text-2xl font-bold">Top Songs</Text>
//                 <TouchableOpacity>
//                   <Text style={tw`text-[${APP_COLOR.PINK}] font-bold text-xl`}>See All</Text>
//                 </TouchableOpacity>
//               </View>
//               <View className="flex-row flex-wrap justify-between pt-3">
//                 {[...Array(6)].map((_, i) => (
//                   <View key={i} className="w-[48%] mb-4">
//                     <View className="w-full h-[100px] bg-neutral-300 rounded-xl mb-2" />
//                     <Text className="text-white font-bold">Song</Text>
//                     <Text className="text-gray-400 text-sm">Artist</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </AnimatedWrapper>
//     </LinearGradient>
//   );
// };

// export default HomeTab;

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import tw from "twrnc";
import { useNavigation } from "expo-router";

const HomeTab = () => {
  const currentOffset = useRef(0);
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const diff = offsetY - currentOffset.current;

    if (diff > 10 && visible) {
      setVisible(false);
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else if (diff < -10 && !visible) {
      setVisible(true);
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          height: 70,
        },
      });
    }

    currentOffset.current = offsetY;
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.5]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView
          className="flex-1 px-4"
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
          <View className="pt-8">
            <LinearGradient
              colors={[APP_COLOR.PINK, APP_COLOR.PURPLE]}
              style={tw`w-full h-[150px] justify-center items-center rounded-[10px]`}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text className="flex text-white font-bold text-2xl absolute left-5 top-5">
                Sing without limits
              </Text>
              <Text className="flex text-white pt-7 mx-5 text-[18px]">
                Subscribes to unlock full versions of the songs and premium features!
              </Text>
            </LinearGradient>

            <View className="mb-6 pt-8">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-2xl font-bold">Playlists</Text>
                <TouchableOpacity>
                  <Text style={tw`text-[${APP_COLOR.PINK}] font-bold text-xl`}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row pt-3"
              >
                {[...Array(5)].map((_, i) => (
                  <View
                    key={i}
                    className="w-[100px] h-[100px] bg-neutral-300  rounded-xl mr-3"
                  />
                ))}
              </ScrollView>
            </View>

            <View className="mb-6 mt-7">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-2xl font-bold">Top Songs</Text>
                <TouchableOpacity>
                  <Text style={tw`text-[${APP_COLOR.PINK}] font-bold text-xl`}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row flex-wrap justify-between pt-3">
                {[...Array(6)].map((_, i) => (
                  <View key={i} className="w-[48%] mb-4">
                    <View className="w-full h-[100px] bg-neutral-300 rounded-xl mb-2" />
                    <Text className="text-white font-bold">Song</Text>
                    <Text className="text-gray-400 text-sm">Artist</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default HomeTab;
