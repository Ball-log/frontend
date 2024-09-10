import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { colors, fonts } from "../../global";
import RNPickerSelect from "react-native-picker-select";
import {
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import BlogScreen from "./ModifyBlog"; // BlogScreen을 별도 파일로 분리
import MvpScreen from "./ModifyMvp"; // MvpScreen을 별도 파일로 분리
import { API_TOKEN } from "@env";

const ModifyScreen = () => {
  const [selectedValue, setSelectedValue] = useState("blog");
  const [post_id, setPostId] = useState(null); // post_id를 저장할 상태
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    // route.params에서 post_id 가져오기
    if (route.params?.post_id) {
      setPostId(route.params.post_id);
    }
  }, [route.params]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleUpdate = async () => {
    try {
      if (!post_id) {
        Alert.alert("Error", "Post ID is missing.");
        return;
      }

      // selectedValue에 따라 BlogScreen 또는 MvpScreen에서 업데이트 요청 처리
      if (selectedValue === "blog") {
        // BlogScreen에서 데이터 가져와서 업데이트
        await axios.patch(
          `https://api.ballog.store/board/post/${post_id}`,
          {
            post_type: "blog", // post_type 필드 추가
            title: "Updated Title",
            body: "Updated Content",
            img_urls: [], // 필요에 따라 수정
            match_id: 0, // match_id 필드 추가, 실제 값을 설정해야 합니다.
          },
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
      } else if (selectedValue === "mvp") {
        // MvpScreen에서 데이터 가져와서 업데이트
        await axios.patch(
          `https://api.ballog.store/board/mvp/${post_id}`,
          {
            post_type: "mvp", // post_type 필드 추가
            title: "Updated Title",
            body: "Updated Content",
            img_urls: [], // 필요에 따라 수정
            match_id: 0, // match_id 필드 추가, 실제 값을 설정해야 합니다.
          },
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
      }
      Alert.alert("Success", "Data updated successfully.");
    } catch (error) {
      console.error("Error updating data:", error);
      Alert.alert("Error", "Failed to update data.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Bar>
          <CloseButton onPress={handleBackPress}>
            <AntDesign name="close" size={24} color="#33363f" />
          </CloseButton>
          <DropdownContainer>
            <DropdownTouchable>
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
                  },
                }}
              />
              <AntDesign
                name="caretdown"
                size={12}
                color="black"
                style={{ marginLeft: 5, marginTop: -3 }}
              />
            </DropdownTouchable>
          </DropdownContainer>
          <PostButton onPress={handleUpdate}>
            <ButtonText>수정하기</ButtonText>
          </PostButton>
        </Bar>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {selectedValue === "blog" && <BlogScreen post_id={post_id} />}
          {selectedValue === "mvp" && <MvpScreen />}
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

const DropdownContainer = styled.View``;

const DropdownTouchable = styled.TouchableOpacity`
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

export default ModifyScreen;
