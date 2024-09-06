import React from "react";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";

const CommentInputBox = ({
  mode,
  newText,
  setNewText,
  showReplyInputBox,
  handlePostComment,
  handlePatchComment,
}) => {
  return (
    <InputWrapper>
      <InputBoxWrapper style={{ opacity: showReplyInputBox ? 0.5 : 1 }}>
        <InputBox
          placeholder={
            mode === "postComment"
              ? "댓글을 입력해주세요"
              : mode === "patchComment"
              ? "댓글을 수정해주세요"
              : ""
          }
          placeholderTextColor="#B5B5B5"
          multiline
          value={newText}
          onChangeText={text => setNewText(text)}
          editable={!showReplyInputBox} // 답글창이 열려있을 때 댓글창 비활성화
        />
        <UploadButton
          onPress={() => {
            if (mode === "postComment") {
              handlePostComment();
            } else if (mode === "patchComment") {
              handlePatchComment();
            }
          }}
          disabled={showReplyInputBox}
        >
          <Feather name="send" size={24} color={showReplyInputBox ? "#B5B5B5" : "#C51E3A"} />
        </UploadButton>
      </InputBoxWrapper>
    </InputWrapper>
  );
};

const InputWrapper = styled.View`
  width: 100%;
  padding: 10px;
  background-color: #fff;
  border-top-width: 0.5px;
  border-color: #d9d9d9;
`;

const InputBoxWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 48px;
  border-radius: 36px;
  border: 1px solid #c51e3a;
  padding: 0 10px;
`;

const InputBox = styled.TextInput`
  flex: 1;
  padding: 8px 10px;
`;

const UploadButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 0 10px;
`;

export default CommentInputBox;