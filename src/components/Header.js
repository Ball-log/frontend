import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Platform, StatusBar, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';
import { getSocket } from './../utils/socket'; // Singleton 웹소켓 가져오기

const { width } = Dimensions.get('window');

const Header = () => {
  const navigation = useNavigation();
  const [hasNotification, setHasNotification] = useState(false); // 알림 상태 관리
  const [message, setMessage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // 초기 투명도 0 (보이지 않음)

  useEffect(() => {
    const socket = getSocket(); // 웹소켓 인스턴스 가져오기

    // 알림을 받을 때마다 상태 업데이트
    socket.on('ararm', (data) => {
      console.log('Received message in header:', data);
      setHasNotification(true); // 알림이 오면 빨간 점을 표시
      showMessage(data);
    });
  }, []);

  const showMessage = (data) => {
    setMessage(data);

    // 배너를 나타나게 하는 애니메이션 (투명도 0 -> 1)
    Animated.timing(fadeAnim, {
      toValue: 1, // 완전히 보이도록 설정
      duration: 500, // 0.5초 동안 애니메이션
      useNativeDriver: true,
    }).start(() => {
      // 일정 시간 후에 배너를 자동으로 숨김
      setTimeout(hideMessage, 3000); // 3초 동안 표시
    });
  };
  const hideMessage = () => {
    // 배너를 다시 숨기는 애니메이션 (투명도 1 -> 0)
    Animated.timing(fadeAnim, {
      toValue: 0, // 완전히 사라지도록 설정
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setMessage(null); // 메시지를 지움
    });
  };

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
      {
        message && (
          <Animated.View style={[styles.banner, { opacity: fadeAnim }]}>
            <Text style={styles.bannerText}>{message}</Text>
          </Animated.View>
        )
      }
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
  banner: {
    position: 'absolute',
    top: 100, // 화면의 상단에서 100px 아래 위치
    width: Dimensions.get('window').width,
    backgroundColor: '#f8d7da',
    padding: 15,
    alignItems: 'center',
    zIndex: 1000, // 배너가 다른 UI 요소 위에 표시되도록
  },
  bannerText: {
    color: '#721c24',
    fontWeight: 'bold',
  },
});

export default Header;
