import React from 'react';
import styled from 'styled-components/native';
import { Feather } from "@expo/vector-icons";

const TextInputBox = ({ 
  onSubmit, 
  value, 
  onChange, 
  onCancel, 
  mode,
}) => {
  return (
    <Wrapper>
        <InputWrapper>
        <Input
            placeholder={
              mode === 'patchComment' ? "댓글을 수정해주세요" :
              mode === 'postReply' ? "답글을 입력해주세요" : 
              mode === 'patchReply' ? "답글을 수정해주세요" : 
              ""
            }
            placeholderTextColor="#B5B5B5"
            multiline
            value={value}
            onChangeText={text => onChange(text)}
        />
        <ActionsWrapper>
            <CancelButton onPress={onCancel}>
              <CancelText>취소</CancelText>
            </CancelButton>
            <SubmitButton onPress={onSubmit}>
              <Feather name="send" size={18} color="#C51E3A" />
            </SubmitButton>
        </ActionsWrapper>
        </InputWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.View`
    background-color: #f2f2f2;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #c51e3a;
  border-radius: 36px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 25px;
  margin-left: 25px;
  height: 40px;
`;

const Input = styled.TextInput`
  flex: 1;
  font-family: "Inter-Regular";
  font-size: 12px;
  padding: 1px 3px;
`;

const ActionsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CancelButton = styled.TouchableOpacity`
  margin-right: 10px;
`;

const CancelText = styled.Text`
  color: #C51E3A;
`;

const SubmitButton = styled.TouchableOpacity``;

export default TextInputBox;