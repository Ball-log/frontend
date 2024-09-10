import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { colors, fonts } from "../../global";
import RNPickerSelect from "react-native-picker-select";
import { AntDesign } from "@expo/vector-icons";
import BlogScreen from "./BlogScreen";
import MvpScreen from "./MvpScreen";
import { getPresignedUrl, uploadFileToS3 } from "../../components/S3";
import {
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_TOKEN } from "@env";
import { store } from "../../utils/secureStore";

const PostScreen = () => {
  
  const [selectedValue, setSelectedValue] = useState("blog");
  const [blogData, setBlogData] = useState({});
  const [mvpData, setMvpData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [resetKey, setResetKey] = useState(0); // 리렌더링을 위한 키
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function getToken() {
      console.log('Component mounted');
      try {
        const token = await store.get("Authorization");
        setToken(token);  // token 값을 상태에 저장
      } catch (error) {
        console.error('Error get token:', error);
      }
    }

    // 비동기 함수 호출
    getToken();

    return () => {
      console.log('Cleanup if necessary');
    };
  }, []);

  const resetBlogData = () => {
    setBlogData({});
    setResetKey((prevKey) => prevKey + 1); // 키를 변경하여 강제 리렌더링
  };

  const resetMvpData = () => {
    setMvpData({});
    setResetKey((prevKey) => prevKey + 1); // 키를 변경하여 강제 리렌더링
  };

  const onDataChange = (data) => {
    if (selectedValue === "blog") {
      setBlogData(data);
    } else if (selectedValue === "mvp") {
      setMvpData(data);
    }
  };

  const uploadImageToS3 = async (image) => {
    try {
      setUploading(true);

      const fileName = image.split("/").pop();
      const fileType = `image/${fileName.split(".").pop()}`;
      const presignedUrl = await getPresignedUrl(fileName, "post", fileType);
      const response = await fetch(image);
      if (!response.ok) throw new Error("이미지 다운로드 실패");
      const blob = await response.blob();
      await uploadFileToS3(presignedUrl, blob);

      const uploadedImageUrl = presignedUrl.split("?")[0];
      console.log("업로드된 이미지 URL:", uploadedImageUrl);

      return uploadedImageUrl;
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      alert("이미지 업로드 실패: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const submitPost = async () => {
    let uploadedImageUrls = [];
    const imagesToUpload =
      selectedValue === "blog" ? blogData.images : mvpData.images;

    if (imagesToUpload && imagesToUpload.length > 0) {
      for (const image of imagesToUpload) {
        const uploadedUrl = await uploadImageToS3(image);
        if (uploadedUrl) {
          uploadedImageUrls.push(uploadedUrl);
        }
      }
    }

    console.log("업로드된 이미지 URLs:", uploadedImageUrls);

    const apiUrl = "https://api.ballog.store";
    const endpoint = "/board/post";
    try {
      const response = await axios.post(
        `${apiUrl}${endpoint}`,
        {
          post_type: selectedValue,
          ...(selectedValue === "blog" && {
            title: blogData.title,
            body: blogData.content,
            img_urls: uploadedImageUrls,
            match_id: 0,
          }),
          ...(selectedValue === "mvp" && {
            playerId: mvpData.playerId,
            playerRecord: mvpData.playerRecord,
            img_urls: uploadedImageUrls,
            match_id: 0,
          }),
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);

      if (response.status === 200) {
        Alert.alert("성공", "게시물이 성공적으로 업로드되었습니다!");

        // 상태 초기화
        if (selectedValue === "blog") {
          resetBlogData();
        } else if (selectedValue === "mvp") {
          resetMvpData();
        }
        setSelectedValue("blog");
      } else {
        Alert.alert("오류", "게시물을 업로드하는 중 문제가 발생했습니다.");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("서버 오류", "서버에서 처리 중 문제가 발생했습니다.");
      } else if (error.request) {
        console.error("Error Request:", error.request);
        Alert.alert("요청 오류", "서버에서 응답을 받지 못했습니다.");
      } else {
        console.error("Error Message:", error.message);
        Alert.alert("오류", "요청 중 문제가 발생했습니다.");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Bar>
          <CloseButton>
            <AntDesign name="close" size={24} color="#33363f" />
          </CloseButton>
          <DropdownContainer>
            <RNPickerSelect
              value={selectedValue}
              items={[
                { label: "BLOG", value: "blog" },
                { label: "MVP", value: "mvp" },
              ]}
              onValueChange={(value) => setSelectedValue(value)}
              style={{
                inputIOS: {
                  fontSize: fonts.sizes.medium,
                  fontWeight: fonts.weights.regular,
                  color: colors.text,
                  padding: 10,
                },
                inputAndroid: {
                  fontSize: fonts.sizes.medium,
                  fontWeight: fonts.weights.regular,
                  color: colors.text,
                  padding: 10,
                  width: 120,
                },
              }}
            />
            {Platform.OS === "ios" ? (
              <AntDesign
                name="caretdown"
                size={12}
                color="black"
                style={{ marginLeft: 5, marginTop: -3 }}
              />
            ) : null}
          </DropdownContainer>
          <PostButton onPress={submitPost}>
            <ButtonText>등록하기</ButtonText>
          </PostButton>
        </Bar>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {selectedValue === "blog" && (
            <BlogScreen
              key={resetKey} // 강제 리렌더링을 위한 키
              onDataChange={onDataChange}
              blogData={blogData}
              resetBlogData={resetBlogData}
            />
          )}
          {selectedValue === "mvp" && (
            <MvpScreen
              key={resetKey} // 강제 리렌더링을 위한 키
              onDataChange={onDataChange}
              mvpData={mvpData}
              resetMvpData={resetMvpData}
            />
          )}
        </ScrollView>
      </Container>
    </TouchableWithoutFeedback>
  );
};

const Container = styled.View`
  flex: 1;
`;

const Bar = styled.View`
  flex-direction: row;
  padding: 8px;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.TouchableOpacity``;

const DropdownContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 40px;
`;

const PostButton = styled.TouchableOpacity`
  border-radius: 26px;
  background-color: ${colors.primary};
  border: 1px solid ${colors.primary};
  width: 77px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: ${fonts.sizes.medium};
  font-weight: ${fonts.weights.regular};
  color: white;
`;

export default PostScreen;
