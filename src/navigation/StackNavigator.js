// StackNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import Header from "../components/Header";
import StartPage from "../screens/StartPage"; // StartPage 파일 경로
import Login from "../screens/Login"; // Login 파일 경로
import TeamSelect from "../screens/TeamSelect";
import ProfileImage from "../screens/ProfileImage";
import CommunityScreen from "../screens/community/CommunityScreen";
import ComuWriteScreen from "../screens/community/ComuWriteScreen";
import ComuPostedScreen from "../screens/community/ComuPostedScreen";
import NotificationScreen from "../screens/NotificationScreen";
import CheckBlog from "../screens/board/CheckBlogScreen";
import CheckMVP from "../screens/board/CheckMvpScreen";
import PostScreen from "../screens/board/PostScreen";
import Comment from "../screens/comment/CommentScreen";
import Modify from "../screens/board/ModifyScreen";


const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: () => <Header />, // 커스텀 헤더를 적용
        }}
      >
        <Stack.Screen
          name="StartPage"
          component={StartPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeamSelect"
          component={TeamSelect}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileImage"
          component={ProfileImage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
        <Stack.Screen name="ComuWriteScreen" component={ComuWriteScreen} />
        <Stack.Screen name="ComuPostedScreen" component={ComuPostedScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="CheckBlog" component={CheckBlog} />
        <Stack.Screen name="CheckMVP" component={CheckMVP} />
        <Stack.Screen name="PostScreen" component={PostScreen} />
        <Stack.Screen name="Comment" component={Comment} />
        <Stack.Screen name="Modify" component={Modify} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
