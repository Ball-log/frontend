import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Modal, Button } from 'react-native';
import { colors } from '../global';
import { WebView } from 'react-native-webview'; // WebView import
import { useNavigation } from '@react-navigation/native';
import { store } from '../utils/secureStore'
import { getSocket } from '../utils/socket';  // 웹소켓을 관리하는 파일을 import
import styled from 'styled-components/native';

import axios from 'axios';

const Login = () => {

  const customUserAgent = 'customUserAgent';
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUrl, setModalUrl] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const navigation = useNavigation(); // Initialize navigation
  
  const onPressHandler = () => {
    navigation.navigate('ProfileImage')
  };

  async function saveToken(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      console.log(response)
      const Authorization = response.headers.authorization;
      const refreshtoken = response.headers.refreshtoken;
      const user_id = response.headers.user_id;
      await store.save('Authorization', Authorization);
      await store.save('refreshtoken', refreshtoken);
      await store.save('user_id', user_id);
      getSocket(user_id)
      onPressHandler()
    } catch (error) {
      console.error('Error fetching data!!!:', error);
    }
  };  

  const handleNavigationStateChange = (navState) => {
    const url = navState.url;
    if (url !== redirectUrl && url.includes('redirect') && !url.includes('oauth')) {
      
      setRedirectUrl(url);
      const code = url.split('?')[1]
      const token_url = modalUrl + '/token?' + code
      fetchData(token_url)
      setModalVisible(false)
      
    }
    //setModalVisible(false);
    
  };

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.logo}>Ballog</Text>
        </View>
      </SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.text}>안녕하세요,{'\n'}회원가입을 환영합니다</Text>
      </View>
      <TouchableOpacity style={styles.googlebutton} onPress={() => {
            setModalVisible(true)
            setModalUrl('https://api.ballog.store/auth/signUp/google')
          }
        }>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('../assets/Google.png')} />
        </View>
        <Text style={styles.buttonText}>구글로 회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.naverbutton} onPress={() => {
            setModalVisible(true)
            setModalUrl('https://api.ballog.store/auth/signUp/naver')
          }
        }>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('../assets/naverlogo.png')} />
        </View>
        <Text style={styles.buttonText}>네이버로 회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.kakaobutton} onPress={() => {
            setModalVisible(true)
            setModalUrl('https://api.ballog.store/auth/signUp/kakao')
          }
        }>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('../assets/kakaologo.png')} />
        </View>
        <Text style={styles.kakaobuttonText}>카카오로 회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googlebutton} onPress={() => {
            setModalVisible(true)
            setModalUrl('https://api.ballog.store/auth/login/google')
          }
        }>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('../assets/Google.png')} />
        </View>
        <Text style={styles.buttonText}>구글로 계속하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.naverbutton} onPress={() => {
            setModalVisible(true)
            setModalUrl('https://api.ballog.store/auth/login/naver')
          }
        }>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('../assets/naverlogo.png')} />
        </View>
        <Text style={styles.buttonText}>네이버로 계속하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.kakaobutton} onPress={() => {
            setModalVisible(true)
            setModalUrl('https://api.ballog.store/auth/login/kakao')
          }
        }>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('../assets/kakaologo.png')} />
        </View>
        <Text style={styles.kakaobuttonText}>카카오로 계속하기</Text>
      </TouchableOpacity>
      
      

      {/* 카카오 로그인 모달 */}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <WebView
            source={{ uri: modalUrl }}
            userAgent={customUserAgent}
            onNavigationStateChange={handleNavigationStateChange}
            style={styles.webView}
          />
          <Button title="닫기" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  safeArea: {
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
  },
  logo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#b91d47',
    marginLeft: 10,
  },
  container: {
    
    marginTop: 280,
    marginLeft: 25,
    height: 100,
  },
  text: {
    fontWeight: '800',
    fontSize: 28,
  },
  googlebutton: {
    backgroundColor: colors.primary,
    width: 342,
    height: 50,
    borderRadius: 44,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.primary,
    margin: 5,
  },
  naverbutton: {
    backgroundColor: '#6AC569',
    width: 342,
    height: 50,
    borderRadius: 44,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#6AC569',
    margin: 5,
  },
  kakaobutton: {
    backgroundColor: '#F2E147',
    width: 342,
    height: 50,
    borderRadius: 44,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F2E147',
    margin: 5,
  },
  imageContainer: {
    width: 55,
    height: 48,
    borderTopLeftRadius: 44,
    borderBottomLeftRadius: 44,
    overflow: 'hidden',
    backgroundColor: '#fff',  // Adjust this color as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '60%',
    height: '60%',
    resizeMode: 'cover',
  },
  buttonText: {
    flex: 1,
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
  },
  kakaobuttonText: {
    flex: 1,
    color: '#000',
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  webView: {
    flex: 1,
    width: 300,
    height: 300,
  },
});

export default Login;