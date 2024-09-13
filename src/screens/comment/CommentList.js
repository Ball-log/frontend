import React from "react";
import styled from "styled-components/native";
import TextInputBox from "./TextInputBox";

const CommentList = ({
  postData,
  mode,
  newText,
  setNewText,
  replyText,
  setReplyText,
  setSelectedTextId,
  setMode,
  showCommentEditBox,
  setShowCommentEditBox,
  showReplyInputBox,
  setShowReplyInputBox,
  showReplyEditBox,
  setShowReplyEditBox,
  handlePatchComment,
  handlePostReply,
  handlePatchReply,
  handleDeleteComment,
  handleDeleteReply,
  getRepliesForComment,
  onCancel,
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
                  <DateTime>{`${comment.comment_date.split(" ")[0]} | ${comment.comment_date.split(" ")[1]}`}</DateTime>
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
                          setNewText(comment.comment_body);
                          setMode("patchComment");
                          setShowCommentEditBox(comment.comment_id);
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

            {/*댓글 수정 시 뜨는 모달*/}
            {showCommentEditBox === comment.comment_id && (
              <TextInputBox
                value={newText}
                onChange={text => setNewText(text)}
                onSubmit={handlePatchComment}
                onCancel={onCancel}
                mode={mode}
              />
            )}

            {/*답글 작성 시 뜨는 모달*/}
            {showReplyInputBox === comment.comment_id && (
              <TextInputBox
                value={replyText}
                onChange={setReplyText}
                onSubmit={handlePostReply}
                onCancel={onCancel}
                mode={mode}
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
                          <DateTime>{`${reply.reply_date.split(" ")[0]} | ${reply.reply_date.split(" ")[1]}`}</DateTime>
                          {reply.reply_isMine && (
                            <>
                              <ReplyButton
                                onPress={() => {
                                  setSelectedTextId(reply.reply_id);
                                  setReplyText(reply.reply_body);
                                  setMode("patchReply");
                                  setShowReplyEditBox(reply.reply_id);
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

                    {/*답글 수정 시 뜨는 모달*/}
                    {showReplyEditBox === reply.reply_id && (
                      <TextInputBox
                        value={replyText}
                        onChange={text => setReplyText(text)}
                        onSubmit={handlePatchReply}
                        onCancel={onCancel}
                        mode={mode}
                      />
                    )}

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

const ScrollContainer = styled.View`
  flex: 1;
`;

const CommentBox = styled.View`
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