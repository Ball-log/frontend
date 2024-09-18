// MyPageStackNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyPageScreen from "../screens/myPage/MyPageScreen";
import SettingScreen from "../screens/myPage/SettingScreen";
import LogoutScreen from "../screens/myPage/LogoutScreen";
import MyPostScreen from "../screens/myPage/MyPostScreen";


const Stack = createStackNavigator();

const MyPageStackNavigator = ( {route}) => {
  const { team, profileImgUrl } = route.params || {};

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyPageScreen" component={MyPageScreen} initialParams={{ team, profileImgUrl }} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} initialParams={{ team, profileImgUrl }} />
      <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
      <Stack.Screen name="MyPostScreen" component={MyPostScreen} />

    </Stack.Navigator>
  );
};

export default MyPageStackNavigator;
