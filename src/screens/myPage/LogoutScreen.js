// LogoutScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const LogoutScreen = ({route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const data = route.params?.data;
  const profileImgUrl = route.params?.profileImgUrl;
  
  console.log('data', data);
  console.log('profileImgUrl: ', profileImgUrl);

  const onPressHandler = () => {
    setModalVisible(true);
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    setModalVisible(false);
    // 로그아웃 처리 로직 추가 해야함
    navigation.navigate("MainTabs", {
      screen: '마이페이지',
    });
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>내 계정</Text>
        </View>
      </View>
      <Image style={styles.image} source={{ uri: profileImgUrl || data.user_icon_url}} />
      <TouchableOpacity style={styles.uploadButton}>
        <Image style={styles.Uploadimage} source={require('../../assets/FixButton.png')} />
      </TouchableOpacity>
      <Text style={styles.username}>{data?.user_name || "이름 없음"}</Text>
      <Text style={styles.email}>balllog07@gmail.com</Text>
      <TouchableOpacity style={styles.button} onPress={onPressHandler}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>로그아웃</Text>
            <Text>로그아웃 하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>취소</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.confirmButton]} onPress={handleLogout}>
                <Text style={styles.modalButtonText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    width: '100%',
  },
  ReturnImage: {
    width: 6,
    height: 12,
  },
  backButton: {
    width: 30,
    height: 30,
    position: 'absolute',
    marginHorizontal: 13,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  image: {
    width: 113,
    height: 113,
    resizeMode: 'contain',
    marginTop: 50,
    borderRadius: 100,
  },
  uploadButton: {
    position: 'absolute',
    top: 175,
    right: 138,
  },
  Uploadimage: {
    width: 32,
    height: 32,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 7,
  },
  email:{
    fontSize: 12,
  },
  button: {
    backgroundColor: '#C51E3A',
    width: '90%',
    height: 55,
    padding: 10,
    margin: 10,
    marginTop: 300,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    width: 154,
    height: 42,
    borderRadius: 44,
    margin: 5,
    backgroundColor: '#C51E3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#C51E3A',
  },
});

export default LogoutScreen;