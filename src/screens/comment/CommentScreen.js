import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components/native";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Context } from '../../context/context';

const Comment = () => {
  const { community_context, postData, postList } = useContext(Context);
  const navigation = useNavigation();
  const route = useRoute();
  // Extract both `post_id` and `post_id_mvp` from route params
  const { post_id, post_id_mvp } = route.params;

  // Determine which ID to use
  const resolvedPostId = post_id_mvp || post_id;

  const [blogData, setBlogData] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState(null);
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

  useEffect(() => {
    setPostData(route.params);
  }, [route.params]);

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
    setSelectedCommentId(null); // 터치 시 답글 입력 모드를 해제
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const getRepliesForComment = (commentId) => {
    return blogData.reply_list.filter(
      (reply) => reply.commented_id === commentId
    );
  };

  const handleSubmitReply = async () => {
    if (!newReply.trim()) return;

    try {
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
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
                댓글 {blogData ? blogData.comment_list.length : "Loading..."}
              </CommentText>
            </CommentWrapper>
          </CommentHeader>
          <ContentWrapper>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: keyboardHeight + 80,
              }}
            >
              <Container>
                {blogData && blogData.comment_list
                  ? blogData.comment_list.map((comment) => (
                      <CommentsBoxWrapper key={comment.comment_id}>
                        <CommentsBox>
                          <UserInfo>
                            <UserNameWrapper>
                              <UserImage
                                source={require("../../assets/Profile.png")}
                              />
                              <UserName>
                                {comment.comment_user_name}
                                {"  "}
                                {comment.comment_user_id ==
                                  blogData.user_id && (
                                  <MeBox>
                                    <Me>나</Me>
                                  </MeBox>
                                )}
                              </UserName>
                            </UserNameWrapper>
                          </UserInfo>
                          <DetailTimeWrapper>
                            <CommentDetail>
                              {comment.comment_body}
                            </CommentDetail>
                            <DetailFooter>
                              <DateTime>{comment.comment_date}</DateTime>
                              <ReplyButton
                                onPress={() =>
                                  setSelectedCommentId(comment.comment_id)
                                }
                              >
                                <ReplyButtonText>답글</ReplyButtonText>
                              </ReplyButton>
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
                                          source={require("../../assets/Profile.png")}
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
                                        <DateTime>{reply.reply_date}</DateTime>
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
            </ScrollView>
            <CommentsFooter>
              <InputBoxWrapper>
                <UserImage source={require("../../assets/Profile.png")} />
                {selectedCommentId ? (
                  <CommentInputBox
                    placeholder="답글을 입력해주세요"
                    placeholderTextColor={"#B5B5B5"}
                    multiline
                    value={newReply}
                    onChangeText={(text) => setNewReply(text)}
                  />
                ) : (
                  <CommentInputBox
                    placeholder="댓글을 입력해주세요"
                    placeholderTextColor={"#B5B5B5"}
                    multiline
                    value={newComment}
                    onChangeText={(text) => setNewComment(text)}
                  />
                )}
                <UploadButton
                  onPress={
                    selectedCommentId ? handleSubmitReply : handleSubmitComment
                  }
                >
                  <Feather name="send" size={24} color="#C51E3A" />
                </UploadButton>
              </InputBoxWrapper>
            </CommentsFooter>
          </ContentWrapper>
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
export default Comment;
