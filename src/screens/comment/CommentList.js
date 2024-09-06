import React from "react";
import styled from "styled-components/native";
import ReplyInputBox from "./ReplyInputBox";

const CommentList = ({
  postData,
  mode,
  replyText,
  setReplyText,
  selectedTextId,
  setSelectedTextId,
  setMode,
  showReplyInputBox,
  setShowReplyInputBox,
  handlePostReply,
  handlePatchReply,
  handleDeleteComment,
  handleDeleteReply,
  getRepliesForComment,
  inverted
}) => {
  return (
    <ScrollContainer inverted={inverted}>
      <CommentBox>
        {postData && postData.comment_list ? postData.comment_list.map((comment) => (
          <CommentsBoxWrapper key={comment.comment_id}>
            <CommentsBox>
              <UserInfo>
                <UserNameWrapper>
                  <UserImage source={{ uri: comment.comment_user_icon_url }} />
                  <UserName>{comment.comment_user_name}</UserName>
                </UserNameWrapper>
              </UserInfo>
              <DetailTimeWrapper>
                <CommentDetail>{comment.comment_body}</CommentDetail>
                <DetailFooter>
                  <DateTime>{`${comment.comment_date.split("T")[0]} | ${comment.comment_date.split("T")[1].split(".")[0]}`}</DateTime>
                  <ReplyButton
                    onPress={() => {
                      setSelectedTextId(comment.comment_id);
                      setMode("postReply");
                      setReplyText("");
                      setShowReplyInputBox(comment.comment_id);
                    }}
                  >
                    <ReplyButtonText>답글</ReplyButtonText>
                  </ReplyButton>
                  {comment.comment_isMine && (
                    <>
                      <ReplyButton
                        onPress={() => {
                          setSelectedTextId(comment.comment_id);
                          setReplyText(comment.comment_body);
                          setMode("patchComment");
                        }}
                      >
                        <ReplyButtonText>수정</ReplyButtonText>
                      </ReplyButton>
                      <ReplyButton onPress={() => handleDeleteComment(comment.comment_id)}>
                        <ReplyButtonText>삭제</ReplyButtonText>
                      </ReplyButton>
                    </>
                  )}
                </DetailFooter>
              </DetailTimeWrapper>
            </CommentsBox>

            {showReplyInputBox === comment.comment_id && (
              <ReplyInputBox
                value={replyText}
                onChange={setReplyText}
                onSubmit={mode === "postReply" ? handlePostReply : handlePatchReply}
                onCancel={() => setShowReplyInputBox(null)}
              />
            )}

            {getRepliesForComment(comment.comment_id).length > 0 && (
              <RepliesWrapper>
                {getRepliesForComment(comment.comment_id).map((reply) => (
                  <CommentsBoxWrapper key={reply.reply_id}>
                    <CommentsBox>
                      <UserInfo>
                        <UserNameWrapper>
                          <ReplyIcon source={require("../../assets/ReplyIcon.png")} />
                          <UserImage source={{ uri: reply.reply_user_icon_url }} />
                          <UserName>{reply.reply_user_name}</UserName>
                        </UserNameWrapper>
                      </UserInfo>
                      <DetailTimeWrapper>
                        <CommentDetail>{reply.reply_body}</CommentDetail>
                        <DetailFooter>
                          <DateTime>{`${reply.reply_date.split("T")[0]} | ${reply.reply_date.split("T")[1].split(".")[0]}`}</DateTime>
                          {reply.reply_isMine && (
                            <>
                              <ReplyButton
                                onPress={() => {
                                  setSelectedTextId(reply.reply_id);
                                  setReplyText(reply.reply_body);
                                  setMode("patchReply");
                                  setShowReplyInputBox(comment.comment_id);
                                }}
                              >
                                <ReplyButtonText>수정</ReplyButtonText>
                              </ReplyButton>
                              <ReplyButton onPress={() => handleDeleteReply(reply.reply_id)}>
                                <ReplyButtonText>삭제</ReplyButtonText>
                              </ReplyButton>
                            </>
                          )}
                        </DetailFooter>
                      </DetailTimeWrapper>
                    </CommentsBox>
                  </CommentsBoxWrapper>
                ))}
              </RepliesWrapper>
            )}
          </CommentsBoxWrapper>
        )) : null}
      </CommentBox>
    </ScrollContainer>
  );
};

const ScrollContainer = styled.ScrollView`
    flex: 1;
`;

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

const ReplyIcon = styled.Image`
  position: absolute;
  left: -20px;
  top: 10px;
  width: 12.73px;
  height: 14.09px;
`;

const RepliesWrapper = styled.View`
  padding-left: 20px;
  background-color: #f2f2f2;
`;

export default CommentList;