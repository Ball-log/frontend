import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from "../global";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const notificationsData = [
  { id: '1', date: '06/24 | 20:50' },
  { id: '2', date: '06/24 | 20:50' },
];

// 데이터 변환 함수
const formatDate = (dateString) => {
  const [datePart] = dateString.split(' | ');
  const [month, day] = datePart.split('/');
  return `${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [touched, setTouched] = useState({});

  const handleTouch = (id) => {
    setTouched({ ...touched, [id]: true });
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleOpen = (id) => {
    // 나중에 해당 블로그 게시물로 이동하는 기능 추가
    console.log(`Open notification ${id}`);
  };

  const renderItem = ({ item }) => {
    let text = '';
    let icon = '';

    switch (item.id) {
      case '1':
        text = '블로그 게시물에 좋아요 반응이 있어요.';
        icon = 'heart-outline';
        break;
      case '2':
        text = '블로그 게시물에 댓글이 달렸어요.';
        icon = 'chatbubble-ellipses-outline';
        break;
      default:
        text = '올바르지 않은 알림';
    }

    return ( // 스와이프하여 삭제
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
            <Ionicons name="trash-bin" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      >
        <TouchableOpacity onPress={() => handleTouch(item.id)}>
          <View style={[styles.notification, touched[item.id] ? styles.notificationTouched : styles.notificationUntouched]}>
            <Ionicons name={icon} size={24} color={colors.primary} style={styles.leftIcon} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                {formatDate(item.date)} {text}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleOpen(item.id)} style={styles.rightIcon}>
              <Ionicons name="open-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  notificationUntouched: { // 터치 전
    backgroundColor: '#C51E3A0A',
  },
  notificationTouched: { // 터치 후
    backgroundColor: '#fff',
  },
  leftIcon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  rightIcon: {
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});

export default NotificationScreen;