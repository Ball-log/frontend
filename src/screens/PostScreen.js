import React, { useState } from "react";
import styled from "styled-components/native";
import { colors, fonts } from "../global";
import RNPickerSelect from "react-native-picker-select";
import { AntDesign } from "@expo/vector-icons";
import BlogScreen from "./BlogScreen"; // BlogScreen을 별도 파일로 분리
import MvpScreen from "./MvpScreen"; // MvpScreen을 별도 파일로 분리
import {
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const PostScreen = () => {
  const [selectedValue, setSelectedValue] = useState("blog");

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
          <PostButton>
            <ButtonText>등록하기</ButtonText>
          </PostButton>
        </Bar>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {selectedValue === "blog" && <BlogScreen />}
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
