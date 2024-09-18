import React, { useState, useEffect, useContext } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
   
import { store } from "../../utils/secureStore";
import { Context } from '../../context/context';

const PostScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedValue, setSelectedValue] = useState("blog");
  const [boardData, setBoardData] = useState({});
  const [state, setState] = useState("write");
  const { board_context, setSelectedMatch, myPage_context, postData } = useContext(Context);

  useEffect(() =>{
    if (route.params && route.params.state === "modify") {
      setState("modify");
      setSelectedValue(route.params.type)
      setBoardData(postData);
      setSelectedMatch(postData.match_info)
    }
  }, [])

  const onDataChange = (data) => {
    if (selectedValue === "blog") {
      setBoardData(data);
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
      selectedValue === "blog" ? boardData.images : mvpData.images;

    if (imagesToUpload && imagesToUpload.length > 0) {
      for (const image of imagesToUpload) {
        const uploadedUrl = await uploadImageToS3(image);
        if (uploadedUrl) {
          uploadedImageUrls.push(uploadedUrl);
        }
      }
    }

    console.log("업로드된 이미지 URLs:", uploadedImageUrls);
    const data = boardData;
    data.img_urls = uploadedImageUrls
    await board_context.post(data)
    const getTodayDateInSeoul = () => {
      const today = new Date();
      const options = { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' };
      
      // "MM/DD/YYYY" 형식으로 변환 후, 원하는 순서로 재정렬
      const [month, day, year] = today.toLocaleDateString('en-US', options).split('/');
      return `${year}-${month}-${day}`;
    };
    await myPage_context.get_post(getTodayDateInSeoul())
    navigation.navigate("MyPostScreen");
    setBoardData({})
    setSelectedMatch(false)
    
  };

  const handleClosePress = ()=>{

    if (state === 'write') {
      navigation.navigate("홈");
      setBoardData({})
      setSelectedMatch(false)
    } else {
      if (selectedValue === "blog") {
        navigation.navigate("CheckBlog");
        setBoardData({})
        setSelectedMatch(false)
      } else {
        navigation.navigate("CheckMVP");
        setBoardData({})
        setSelectedMatch(false)
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Bar>
          <CloseButton onPress={handleClosePress} >
            <AntDesign name="close" size={24} color="#33363f" />
          </CloseButton>
          {state === 'write' ? 
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
            </DropdownContainer>  : null
          }
          <PostButton onPress={submitPost}>
            <ButtonText>{state === 'write' ? '등록하기' : '수정하기'}</ButtonText>
          </PostButton>
        </Bar>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {selectedValue === "blog" && (
            <BlogScreen
              boardData={boardData}
              setBoardData={setBoardData}
            />
          )}
          {selectedValue === "mvp" && (
            <MvpScreen

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
