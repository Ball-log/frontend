import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export default function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          "Inter-Regular": require('../assets/fonts/Inter-Regular.ttf'),
          "Inter-ExtraBold": require('../assets/fonts/Inter-ExtraBold.ttf'),
          "Inter-Bold": require('../assets/fonts/Inter-Bold.ttf'),
          "Inter-SemiBold": require('../assets/fonts/Inter-SemiBold.ttf')
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts: ', error);
      } 
    };
    loadFonts();
  }, []);

  return fontsLoaded;
}
