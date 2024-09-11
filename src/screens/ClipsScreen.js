/*<<<<<<< HEAD
// ClipsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VideoScreen from "./video"

const ClipsScreen = () => {
=======*/
import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getPresignedUrl, uploadFileToS3 } from "../components/S3";
   

const ClipsScreen = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync(); // 이미지 선택 권한 요청
    if (permissionResult.granted === false) {
      alert("카메라 접근 권한이 필요");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // 이미지 선택
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("업로드할 이미지를 선택하세요.");
      return;
    }

    try {
      setUploading(true);

      // 이미지 파일명 및 타입
      const fileName = image.split("/").pop();
      const fileType = `image/${fileName.split(".").pop()}`;

      // S3 프리사인드 URL 요청, 2번째 파라미터를 다른 폴더명으로 변경
      const presignedUrl = await getPresignedUrl(fileName, "clips", fileType);

      // 파일 업로드
      const response = await fetch(image);
      const blob = await response.blob();

      await uploadFileToS3(presignedUrl, blob);

      alert("이미지 업로드 성공");
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      alert("이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  // {image && } 이 부분이 선택한 이미지를 화면에 출력하는 코드
//>>>>>>> main
  return (
    <View style={styles.container}>
      {/*<VideoScreen />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
/*<<<<<<< HEAD
    justifyContent: 'center',
    alignItems: 'center',
=======*/
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
//>>>>>>> main
  },
});

export default ClipsScreen;
