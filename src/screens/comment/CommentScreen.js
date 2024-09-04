import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components/native";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Context } from '../../context/context';
import CommentBody from './CommentBody'

const Comment = () => {
  
  const { postData } = useContext(Context);
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback >
      <Wrapper>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
        >
          <CommentHeader>
            <BackButton onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </BackButton>
            <CommentWrapper>
              <CommentIcon source={require("../../assets/Chat.png")} />
              <CommentText>
                댓글 {postData ? postData.comment_count : "Loading..."}
              </CommentText>
            </CommentWrapper>
          </CommentHeader>
          <CommentBody/>
        </KeyboardAvoidingView>
      </Wrapper>
    </TouchableWithoutFeedback>
  );
};
const Wrapper = styled.View`
  flex: 1;
  background: white;
`;

const CommentHeader = styled.View`
  border: 1px solid #dbdbdb;
  background-color: #fff;
  width: 100%;
  height: 42px;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 13px;
`;

const CommentWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const CommentIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const CommentText = styled.Text`
  font-family: "Inter-Bold";
  font-size: 17px;
  margin: 2px 0 0 4px;
`;

export default Comment;
