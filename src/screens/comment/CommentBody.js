import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components/native";
import {Keyboard} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Context } from '../../context/context';
import ReplyInputBox from "./ReplyInputBox";

const CommentBody = () => {
  const { comment_context, community_context, reply_context, postData } = useContext(Context);
  const route = useRoute();
  const [ type, setType ] = useState(route.params.type)
  const [newText, setNewText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [mode, setMode] = useState("postComment")
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showReplyInputBox, setShowReplyInputBox] = useState(null);

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
    if (!replyText.trim()) return;
    try {
      const req = {
        "body": replyText,
        "post_id": postData.post_id,
        "post_user_id": postData.user_id,
        "comment_id": selectedTextId,
        "post_type": postData.post_type
      }
      setReplyText("");
      setShowReplyInputBox(null);
      await reply_context.post(req);
      await community_context.get(postData.post_id);
      await community_context.get_list(type);

      setReplyText("");
      setShowReplyInputBox(null);
      setMode("postComment");
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handlePatchReply = async () => {
    if (!replyText.trim()) return;
    const req = {
      "id": selectedTextId,
      "body": replyText,
    }
    setReplyText("");
    setShowReplyInputBox(null);
    setMode("postComment");
    await reply_context.patch(req);
    await community_context.get(postData.post_id);
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
      {/*댓글 입력창*/}
      <CommentInputBox style={{ opacity: showReplyInputBox ? 0.5 : 1 }}>
          <InputBoxWrapper>
          {/*<UserImage source={{uri: postData.user_icon_url}} />*/}
          <InputBox
          placeholder={
            mode === 'postComment' ? '댓글을 입력해주세요' :
            mode === 'patchComment' ? '댓글을 수정해주세요' :
            ''
          }
          placeholderTextColor="#B5B5B5"
          multiline
          value={newText}
          onChangeText={text => setNewText(text)}
          editable={!showReplyInputBox}
          />
          <UploadButton
          onPress={() =>{
          //selectedTextId ? handlePostReply : handlePostComment
            if (mode ==="postComment") {
              handlePostComment();
            } else if (mode ==="patchComment") {
              handlePatchComment();
            }
          }} 
          disabled={showReplyInputBox}
          >
            <Feather name="send" size={24} color={showReplyInputBox ? "#B5B5B5" : "#C51E3A"} />
          </UploadButton>
        </InputBoxWrapper>
      </CommentInputBox>

      <ScrollContainer>
          <CommentBox>
            {postData && postData.comment_list
            ? postData.comment_list.map((comment) => (
            <CommentsBoxWrapper key={comment.comment_id}>
              <CommentsBox>
                <UserInfo>
                  <UserNameWrapper>
                    <UserImage 
                    source={{uri: comment.comment_user_icon_url}}
                    />
                    <UserName>{comment.comment_user_name}</UserName>
                  </UserNameWrapper>
                </UserInfo>
                <DetailTimeWrapper>
                  <CommentDetail>{comment.comment_body}</CommentDetail>
                  <DetailFooter>
                    <DateTime>{`${comment.comment_date.split(" ")[0]} | ${comment.comment_date.split(" ")[1]}`}</DateTime>
                    <ReplyButton 
                    onPress={() =>
                      {
                        setSelectedTextId(comment.comment_id)
                        setMode("postReply");
                        setNewText("");
                        setShowReplyInputBox(comment.comment_id);
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

              {/*답글 입력 모달창*/}
              {showReplyInputBox === comment.comment_id && (
              <ReplyInputBox
                value={replyText}
                onChange={setReplyText}
                onSubmit={mode === 'postReply' ? handlePostReply : handlePatchReply}
                onCancel={() => setShowReplyInputBox(null)}
              />
              )}

              {/* 답글 리스트 */}
              {getRepliesForComment(comment.comment_id).length > 0 && (
              <RepliesWrapper>
                {getRepliesForComment(comment.comment_id).map((reply) => (
                  <CommentsBoxWrapper key={reply.reply_id}>
                    <CommentsBox>
                      <UserInfo>
                        <UserNameWrapper>
                          <ReplyIcon source={require("../../assets/ReplyIcon.png")} />
                          <UserImage source={{uri: reply.reply_user_icon_url}} />
                          <UserName>{reply.reply_user_name}</UserName>
                        </UserNameWrapper>
                      </UserInfo>
                      <DetailTimeWrapper>
                        <CommentDetail>{reply.reply_body}</CommentDetail>
                          <DetailFooter>
                            <DateTime>{`${reply.reply_date.split(" ")[0]} | ${reply.reply_date.split(" ")[1]}`}</DateTime>
                            {reply.reply_isMine === true ? (
                              <>
                                <ReplyButton
                                onPress={() =>
                                  {
                                    setSelectedTextId(reply.reply_id);
                                    setReplyText(reply.reply_body);
                                    setMode("patchReply");
                                    setShowReplyInputBox(comment.comment_id);
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
          )) : null}
      </CommentBox>
    </ScrollContainer>
    
  </ContentWrapper>
  )
}

const ContentWrapper = styled.View`
  flex: 1;
`;

const ScrollContainer = styled.ScrollView``;

const CommentBox = styled.View`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
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

const CommentInputBox = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
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

export default CommentBody;