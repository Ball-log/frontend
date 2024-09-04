import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import PostScreen from "../screens/PostScreen";
import ClipsScreen from "../screens/ClipsScreen";
import CommunityScreen from "../screens/community/CommunityScreen";
import MyPageStackNavigator from "./MyPageStackNavigator";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../global";
import { Dimensions, Platform } from "react-native";
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const route = useRoute(); // 이전 화면에서 전달된 params에 접근
  const team = route.params?.team;
  const profileImgUrl = route.params?.user_icon;
  console.log('profileImgUrl: ', profileImgUrl);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "홈") {
            iconName = "home-sharp";
          } else if (route.name === "글쓰기") {
            iconName = "pencil";
          } else if (route.name === "경기 짤방") {
            iconName = "play-circle";
          } else if (route.name === "커뮤니티") {
            iconName = "chatbubbles";
          } else if (route.name === "마이페이지") {
            iconName = "person";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: Platform.OS === "ios" ? width * 0.03 : width * 0.035, // 폰트 크기
          marginBottom: Platform.OS === "android" ? height * 0.01 : 0, // 탭바 내 글씨
        },
        tabBarStyle: {
          height: Platform.OS === "ios" ? height * 0.1 : height * 0.08, // 탭바 높이
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="경기 짤방" component={ClipsScreen} />
      <Tab.Screen name="글쓰기" component={PostScreen} />
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="커뮤니티" component={CommunityScreen} />
      <Tab.Screen name="마이페이지" component={MyPageStackNavigator} initialParams={{team, profileImgUrl}} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
