import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';
import { getSocket } from './../utils/socket'; // Singleton 웹소켓 가져오기

const { width } = Dimensions.get('window');

const Header = () => {
  const navigation = useNavigation();
  const [hasNotification, setHasNotification] = useState(false); // 알림 상태 관리

  useEffect(() => {
    const socket = getSocket(); // 웹소켓 인스턴스 가져오기

    // 알림을 받을 때마다 상태 업데이트
    socket.on('ararm', (data) => {
      console.log('Received message in header:', data);
      setHasNotification(true); // 알림이 오면 빨간 점을 표시
    });
  }, []);

  const handleNotificationPress = () => {
    setHasNotification(false); // 알림 아이콘을 누르면 빨간 점 제거
    navigation.navigate('NotificationScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.logo}>Ballog</Text>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={handleNotificationPress}
        >
          <Ionicons name="notifications-outline" size={width * 0.06} color="black" />
          {hasNotification && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: width * 0.05, 
    backgroundColor: '#f8f8f8',
  },
  logo: {
    fontSize: width * 0.07, 
    fontFamily: 'InterExtraBold',
    color: '#b91d47',
  },
  notificationIcon: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
});

export default Header;
