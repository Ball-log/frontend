import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getPresignedUrl, uploadFileToS3 } from "../../components/S3";
import { Context } from '../../context/context';

const SettingScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const { myPage_context, myPage, postByDate } = useContext(Context);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("카메라 접근 권한이 필요");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);

      try {
        const fileName = selectedImageUri.split("/").pop();
        const fileType = `image/${fileName.split(".").pop()}`;
        
        console.log("!!!", )
        const presignedUrl = await getPresignedUrl(
          fileName,
          "background",
          fileType
        );

        const response = await fetch(selectedImageUri);
        const blob = await response.blob();

        await uploadFileToS3(presignedUrl, blob);

        
        const req = {
          "user_background_img": `https://ballog.s3.ap-northeast-2.amazonaws.com/background/${fileName}`
        }
        await myPage_context.patch_background_img(req)
        await myPage_context.get()
        alert("이미지 업로드 성공");

        navigation.navigate("MyPageScreen");
      } catch (error) {
        console.error("이미지 업로드 중 오류 발생:", error);
        alert("이미지 업로드 실패");
      }
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>설정</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("LogoutScreen")}
      >
        <View style={styles.texts}>
          <Text style={styles.MainText}>{myPage.user_name}</Text>
          <Text style={styles.SubText}>Google 계정</Text>
        </View>
        <Image
          style={styles.ProfileImage}
          source={{uri: myPage.user_icon_url}}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.MainText}>프로필 배경</Text>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Image
            style={styles.BackImage}
            source={require("../../assets/basic.png")}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TeamSelect")}
      >
        <View style={styles.texts}>
          <Text style={styles.MainText}>마이팀 변경</Text>
        </View>
       
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 7,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    marginHorizontal: 13,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    width: "100%",
    height: 97,
    backgroundColor: "#D9D9D9",
    marginVertical: 8,
    borderRadius: 26,
  },
  texts: {
    flexDirection: "column",
  },
  MainText: {
    fontSize: 18,
    fontWeight: "600",
  },
  SubText: {
    fontSize: 10,
    fontWeight: "400",
    marginVertical: 5,
  },
  ProfileImage: {
    width: 57,
    height: 57,
    borderRadius: 100,
  },
  BackImage: {
    width: 84,
    height: 71,
    borderRadius: 10,
  },
  TeamImage: {
    width: 51,
    height: 71,
  },
  image: {
    width: 84,
    height: 71,
    borderRadius: 10,
  },
});

export default SettingScreen;
