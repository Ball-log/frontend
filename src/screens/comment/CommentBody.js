import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components/native";
import {
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Context } from '../../context/context';

const CommentBody = () => {
  const { comment_context, community_context, reply_context, postData } = useContext(Context);
  const route = useRoute();
  const [ type, setType ] = useState(route.params.type)
  const [newText, setNewText] = useState("");
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [mode, setMode] = useState("postComment")
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const getRepliesForComment = (commentId) => {
    return postData.reply_list.filter(
      (reply) => reply.commented_id === commentId
    );
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
    setMode("postComment")
  };

  const handlePostComment = async () => {
    if (!newText.trim()) return;
    try {
      const req = {
      "body": newText,
      "post_id": postData.post_id,
      "post_user_id": postData.user_id,
      "post_type": postData.post_type
      }
      setNewText("")
      await comment_context.post(req);
      await community_context.get(postData.post_id)
      await community_context.get_list(type)
      
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  const handlePatchComment = async () => {
    if (!newText.trim()) return;
    const req = {
      "id": selectedTextId,
      "body": newText,
    }
    setNewText("")
    setMode("postComment")
    await comment_context.patch(req);
    await community_context.get(postData.post_id)
  };
  const handleDeleteComment = async (post_id) => {
    try {
      const req = {
      "id": post_id
      }
      await comment_context.delete(req);
      await community_context.get(postData.post_id)
      await community_context.get_list(type)
      setNewText("")
      setMode("postComment")
    } catch (error) {
      console.error("Error deletting comment:", error);
    }
  };

  const handlePostReply = async () => {
    if (!newText.trim()) return;
    try {
      const req = {
        "body": newText,
        "post_id": postData.post_id,
        "post_user_id": postData.user_id,
        "comment_id": selectedTextId,
        "post_type": postData.post_type
      }
      setNewText("")
      setMode("postComment")
      await reply_context.post(req);
      await community_context.get(postData.post_id)
      await community_context.get_list(type)
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };
  const handlePatchReply = async () => {
    if (!newText.trim()) return;
    const req = {
      "id": selectedTextId,
      "body": newText,
    }
    setNewText("")
    setMode("postComment")
    await reply_context.patch(req);
    await community_context.get(postData.post_id)
  };
  const handleDeleteReply = async (post_id) => {
    try {
      const req = {
      "id": post_id
      }
      await reply_context.delete(req);
      await community_context.get(postData.post_id)
      await community_context.get_list(type)
      setNewText("")
      setMode("postComment")
    } catch (error) {
      console.error("Error deletting reply:", error);
    }
  };
    return (
         <ContentWrapper>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 80,
              }}
            >
              <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
              <Container>
                {postData && postData.comment_list
                  ? postData.comment_list.map((comment) => (
                      <CommentsBoxWrapper key={comment.comment_id}>
                        <CommentsBox>
                          <UserInfo>
                            <UserNameWrapper>
                              <UserImage
                                source={{uri: comment.comment_user_icon_url}}
                              />
                              <UserName>
                                {comment.comment_user_name}
                              </UserName>
                            </UserNameWrapper>
                          </UserInfo>
                          <DetailTimeWrapper>
                            <CommentDetail>
                              {comment.comment_body}
                            </CommentDetail>
                            <DetailFooter>
                              <DateTime>{`${comment.comment_date.split("T")[0]} | ${comment.comment_date.split("T")[1].split(".")[0]}`}</DateTime>
                              <ReplyButton
                                onPress={() =>
                                  {
                                    setSelectedTextId(comment.comment_id)
                                    setMode("postReply")
                                    setNewText("")
                                  }
                                }
                              >
                                <ReplyButtonText>답글</ReplyButtonText>
                              </ReplyButton>
                              {comment.comment_isMine === true ? (
                                <>
                                  <ReplyButton
                                    onPress={() =>
                                      {
                                        setSelectedTextId(comment.comment_id)
                                        setNewText(comment.comment_body)
                                        setMode("patchComment")
                                      }
                                    }
                                  >
                                    <ReplyButtonText>수정</ReplyButtonText>
                                  </ReplyButton>
                                  <ReplyButton
                                    onPress={() =>
                                      {
                                        setSelectedTextId(comment.comment_id);
                                        handleDeleteComment(comment.comment_id);
                                      }
                                    }
                                  >
                                    <ReplyButtonText>삭제</ReplyButtonText>
                                  </ReplyButton>
                                </>
                              ) : null }
                            </DetailFooter>
                          </DetailTimeWrapper>
                        </CommentsBox>
                        {getRepliesForComment(comment.comment_id).length >
                          0 && (
                          <RepliesWrapper>
                            {getRepliesForComment(comment.comment_id).map(
                              (reply) => (
                                <CommentsBoxWrapper key={reply.reply_id}>
                                  <CommentsBox>
                                    <UserInfo>
                                      <UserNameWrapper>
                                        <ReplyIcon
                                          source={require("../../assets/ReplyIcon.png")}
                                        />
                                        <UserImage
                                          
                                          source={{uri: reply.reply_user_icon_url}}
                                        />
                                        <UserName>
                                          {reply.reply_user_name}
                                        </UserName>
                                      </UserNameWrapper>
                                    </UserInfo>
                                    <DetailTimeWrapper>
                                      <CommentDetail>
                                        {reply.reply_body}
                                      </CommentDetail>
                                      <DetailFooter>
                                        <DateTime>{`${reply.reply_date.split("T")[0]} | ${reply.reply_date.split("T")[1].split(".")[0]}`}</DateTime>
                                        {reply.reply_isMine === true ? (
                                          <>
                                            <ReplyButton
                                              onPress={() =>
                                                {
                                                  setSelectedTextId(reply.reply_id);
                                                  setNewText(reply.reply_body);
                                                  setMode("patchReply");
                                                }
                                              }
                                            >
                                              <ReplyButtonText>수정</ReplyButtonText>
                                            </ReplyButton>
                                            <ReplyButton
                                              onPress={() =>
                                                {
                                                  setSelectedTextId(reply.reply_id);
                                                  handleDeleteReply(reply.reply_id);
                                                }
                                              }
                                            >
                                              <ReplyButtonText>삭제</ReplyButtonText>
                                            </ReplyButton>
                                          </>
                                        ) : null }
                                      </DetailFooter>
                                    </DetailTimeWrapper>
                                  </CommentsBox>
                                </CommentsBoxWrapper>
                              )
                            )}
                          </RepliesWrapper>
                        )}
                      </CommentsBoxWrapper>
                    ))
                  : null}
              </Container>
              </TouchableWithoutFeedback>
            </ScrollView>
            <CommentsFooter>
              <InputBoxWrapper>
                {/*<UserImage source={{uri: postData.user_icon_url}} />*/}
                <CommentInputBox
                  placeholder={
                    mode === 'postComment' ? '댓글을 입력해주세요' :
                    mode === 'patchComment' ? '댓글을 수정해주세요' :
                    mode === 'postReply' ? '답글을 입력해주세요' :
                    mode === 'patchReply' ? '답글을 수정해주세요' :
                    ''
                  }
                  placeholderTextColor="#B5B5B5"
                  multiline
                  value={newText}
                  onChangeText={text => setNewText(text)}
                />
                <UploadButton
                  onPress={() =>{
                    //selectedTextId ? handlePostReply : handlePostComment
                    if (mode ==="postComment") {
                      handlePostComment()
                    } else if (mode ==="patchComment") {
                      handlePatchComment()
                    } else if (mode ==="postReply"){
                      handlePostReply()
                    } else if (mode==="patchReply") {
                      handlePatchReply()
                    }
                  }} 
                >
                  <Feather name="send" size={24} color="#C51E3A" />
                </UploadButton>
              </InputBoxWrapper>
            </CommentsFooter>
          </ContentWrapper>
    )
}
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

const ContentWrapper = styled.View`
  flex: 1;
  position: relative;
`;

const Container = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CommentsBoxWrapper = styled.View``;

const CommentsBox = styled.View`
  padding-top: 13px;
  padding-bottom: 13px;
  padding-left: 25px;
  padding-right: 25px;
  border-bottom-width: 0.5px;
  border-bottom-color: #dbdbdb;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const UserNameWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  position: relative;
`;

const UserImage = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
`;

const UserName = styled.Text`
  font-family: "Inter-Bold";
  font-size: 12px;
  margin-left: 10px;
`;

const DateTime = styled.Text`
  color: #aaaaaa;
  font-size: 11px;
`;

const CommentDetail = styled.Text`
  font-family: "Inter-Regular";
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 10px;
`;

const DetailTimeWrapper = styled.View`
  padding-left: 30px;
`;

const DetailFooter = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ReplyButton = styled.TouchableOpacity`
  margin-left: 10px;
  border-width: 0.5px;
  border-color: #aaaaaa;
  border-radius: 20px;
  padding: 2px 5px;
  justify-content: center;
  align-items: center;
`;

const ReplyButtonText = styled.Text`
  font-family: "Inter-Regular";
  font-size: 9px;
  color: #aaaaaa;
`;

const MeBox = styled.TouchableOpacity`
  margin-left: 30px;
  border-width: 0.5px;
  border-color: #c51e3a;
  border-radius: 20px;
  padding: 2px 7ch;
  justify-content: center;
  align-items: center;
  margin-top: -2px;
`;

const Me = styled.Text`
  font-family: "Inter-Regular";
  font-size: 9px;
  color: #c51e3a;
  padding: 0 5px;
`;

const CommentsFooter = styled.View`
  position: absolute;
  height: 80px;
  bottom: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #fff;
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

const CommentInputBox = styled.TextInput`
  flex: 1;
  font-family: "Inter-Regular";
  padding: 8px 10px;
`;

const UploadButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 0 10px;
`;

const ReplyIcon = styled.Image`
  position: absolute;
  left: -20px;
  top: 10px;
  width: 12.73px;
  height: 14.09px;
  position: absolute;
`;

const RepliesWrapper = styled.View`
  padding-left: 20px;
  background-color: #f2f2f2;
`;

const ReplyInputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 48px;
  border-radius: 36px;
  border: 1px solid #c51e3a;
  padding: 0 10px;
  margin-top: 10px;
`;
export default CommentBody;