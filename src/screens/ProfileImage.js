import React, { useEffect, useState } from 'react';
import { colors } from '../global';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { store } from '../utils/secureStore'
import axios from 'axios';
import * as ImagePicker from "expo-image-picker";
import { getPresignedUrl, uploadFileToS3 } from "../components/S3";

const ProfileImage = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState(null); // State to hold
  const [userIcon, setUserIcon] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await store.get('Authorization');
        
        if (token) {
          const url = 'https://api.ballog.store/auth/signUp/setting';
          const response = await axios.get(url, {
            headers: {
              Authorization: token, // Set Authorization header
            },
          });
          setUserName(response.data.result.user_name); // Set user_name to state
          setUserIcon(response.data.result.user_icon); // Set user_icon URL to state
        }
      } catch (error) {
        console.error('Error fetching data:', error, "여기야?");
      }
    };

    fetchData(); // Fetch data when component mounts or token changes
  }, []); // Empty dependency array to run only once on mount

  const pickProfileImg = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("카메라 접근 권한이 필요");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);

      try {
        const fileName = selectedImageUri.split("/").pop();
        const fileType = `image/${fileName.split(".").pop()}`;

        const presignedUrl = await getPresignedUrl(
          fileName,
          "profile",
          fileType
        );

        const response = await fetch(selectedImageUri);
        const blob = await response.blob();

        await uploadFileToS3(presignedUrl, blob);

        alert("이미지 업로드 성공");

        const newImageUrl = presignedUrl.split("?")[0];
        setUserIcon(newImageUrl); // 업데이트된 프로필 이미지 URL 설정

        alert("이미지 업로드 성공");
        console.log('newImageUrl: ', newImageUrl);

      } catch (error) {
        console.error("이미지 업로드 중 오류 발생:", error);
        alert("이미지 업로드 실패");
      }
    }
  };
  
  const onPressHandler = () => {
    if (userIcon) {
      navigation.navigate('TeamSelect', { user_icon: userIcon });
    } else {
      alert('먼저 프로필 사진을 업로드해주세요.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.returnButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.TeamText}>
          <Text style={styles.SelectText}><Text style={styles.MyTeam}>Ballog </Text>에서 사용할 {'\n'}프로필 사진을 등록하세요</Text>
        </View>
        <View style={styles.buttonContainer}>
            <Image style={styles.image} source={{ uri: userIcon }} />
            <TouchableOpacity style={styles.uploadButton} onPress={pickProfileImg}>
                <Image style={styles.Uploadimage} source={require('../assets/Upload.png')} />
            </TouchableOpacity>
            <Text style={styles.username}>{userName}</Text>
            <TouchableOpacity style={styles.button} onPress={onPressHandler}>
              <Text style={styles.buttonText}>시작하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lateButton} onPress={onPressHandler}>
              <Text style={styles.buttonText}>나중에 바꿀게요</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    marginTop: 140,
    height: 700,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  TeamText:{
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 13,
    marginBottom: 50,
    marginLeft: 10,
  },
  MyTeam:{
    color: colors.primary,
    fontFamily: 'InterExtraBold',
    fontSize: 30,
  },
  SelectText:{
    fontFamily: 'InterExtraBold',
    fontSize: 24,
  }, 
  buttonContainer:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 153,  
    height: 153, 
    resizeMode: 'cover',
    borderRadius: 100,
  }, 
  uploadButton:{
    position: 'absolute',
    bottom: 225,
    right: 100,
  },
  Uploadimage:{
    width: 45,  
    height: 45, 
  },
  username:{
    fontSize: 20,
    fontFamily: 'InterExtraBold',
    marginTop: 20,
  },
  button: {
    borderWidth: 2,
    borderColor: colors.primary,
    width: '100%',
    height: 55,
    padding: 10,
    borderRadius: 44,
    justifyContent: 'center',
    marginTop: 80,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'InterBold',
  },
  lateButton: {
    borderColor: colors.primary,
    width: '100%',
    height: 55,
    borderRadius: 44,
    justifyContent: 'center',
  },
});

export default ProfileImage;