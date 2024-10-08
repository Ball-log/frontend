// App.js
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import useFonts from './src/hooks/useFonts';
import StackNavigator from './src/navigation/StackNavigator';
import { ContextProvider } from './src/context/context';


export default function App() {
  
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ContextProvider>
          
          <StackNavigator />
          <StatusBar style="auto" />
    </ContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
});
