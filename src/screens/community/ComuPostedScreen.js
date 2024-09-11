//ComuPostedScreen.js
import React, {useState, useContext, useEffect} from 'react';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Context } from '../../context/context';
import CommentInputBox from '../comment/CommentInputBox';
import CommentList from '../comment/CommentList';

export default function ComuPostedScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { post_like_context, community_context, postData, comment_context, reply_context } = useContext(Context);
  const [selectedType, setSelectedType] = useState(type);
  const {post_id, type} = route.params;

  const [newText, setNewText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [mode, setMode] = useState("postComment");
  const [showCommentEditBox, setShowCommentEditBox] = useState(null);
  const [showReplyInputBox, setShowReplyInputBox] = useState(null);
  const [showReplyEditBox, setShowReplyEditBox] = useState(null);

  useEffect(() => {
    const setPostData = async () => {
      await community_context.get(post_id);
      setSelectedType(type);
    };
    setPostData();
  }, [route]);

  const handleBackPress = () => {
    navigation.navigate("MainTabs", {
      screen: '커뮤니티',
      params: { type: selectedType, updatedPost: postData }
    });
  };

  const handleToggleLike = async () => {
    try {
      const req = {
        "post_id": postData.post_id,
        "post_user_id": postData.user_id,
        "checked": postData.has_liked,
        "post_type": postData.post_type
      }
      await post_like_context.post(req)
      await community_context.get(postData.post_id);
      await community_context.get_list(selectedType);
      
    } catch (error) {
        console.error('좋아요 상태를 변경하는 중 오류 발생:', error);
    }
  }

  const handleEditPress = () => {
    navigation.navigate('ComuWriteScreen', { isPatch:true, type: selectedType });
  };

  const handleDeletePress = async () => {
    try {
      
      await community_context.delete(postData.post_id);
      await community_context.get_list(selectedType);
      
      navigation.navigate("MainTabs", {
          screen: '커뮤니티',
          params: { type: selectedType }
      });
      
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const getRepliesForComment = (commentId) => {
    return postData.reply_list
      .filter((reply) => reply.commented_id === commentId)
      .reverse();
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
    setShowCommentEditBox(null);
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
    setShowReplyEditBox(null);
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

  const handleCancel = () => {
    setMode("postComment");
    setNewText("");
    setReplyText("");
    setShowCommentEditBox(null);
    setShowReplyInputBox(null);
    setShowReplyEditBox(null);
  };

  return (
    <Wrapper>

      <ComuPostedHeader>
        <BackButton onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </BackButton>
        <ScreenTitleWrapper>
          <ScreenTitle>{selectedType === 'league' ? ('리그 커뮤니티') : ('마이팀 커뮤니티')}</ScreenTitle>
        </ScreenTitleWrapper>
      </ComuPostedHeader>

      <LayoutBox>
        <ComuPostedBox>
          <WriterInfoBox>
            <WriterNameWrapper>
              <UserImage source={{ uri: Array.isArray(postData.user_icon_url) ? postData.user_icon_url[0] : postData.user_icon_url }} />
              <WriterName>{postData.user_name || '사용자'}</WriterName>
            </WriterNameWrapper>
            <DateTime>{`${postData.created_at.split(" ")[0]} | ${postData.created_at.split(" ")[1]}`}</DateTime>
          </WriterInfoBox>
          <PostContents>
            <PostTitle>
              <PostTitleText>{postData.title}</PostTitleText>
            </PostTitle>
            <PostData>
              <PostDataText>{postData.content}</PostDataText>
            </PostData>
          </PostContents>
          <ImageWrapper 
            horizontal 
            hasImages={postData.img_urls.length > 0}
            showsHorizontalScrollIndicator={false}
          >
            {console.log(postData)}
          {postData.img_urls.map((url, index) => (
            <PostImage 
              key={`${url}url`} 
              source={{ uri: typeof url === 'string' ? url : url[0] }}
              isFirst={index === 0}
              isLast={index === postData.img_urls.length - 1}
            />
          ))}
          </ImageWrapper>
          <PostFooter>
            <IconWrapper>
              <LikeIcon onPress={handleToggleLike}>
                <AntDesign name={postData.has_liked ? "heart" : "hearto"} size={12} color="#E05936" />
              </LikeIcon>
              <LikeCount>{postData.like_count}</LikeCount>
              <ChatIcon>
                <MaterialCommunityIcons
                  name="message-reply-outline"
                  size={12}
                  color="#8892F7"
                />
              </ChatIcon>
              <ChatCount>{postData.comment_count}</ChatCount>
            </IconWrapper>
            {
              postData.isMine === true ? (
                <ButtonWrapper>
                  <EditDeleteButton onPress={handleEditPress}>
                    <ButtonText>수정</ButtonText>
                    <MaterialCommunityIcons name="pencil-outline" size={13} color="black" />
                  </EditDeleteButton>
                  <EditDeleteButton onPress={handleDeletePress}>
                    <ButtonText>삭제</ButtonText>
                    <Feather name="trash-2" size={13} color="black" />
                  </EditDeleteButton>
                </ButtonWrapper>
              ) : null
            }
            
          </PostFooter>
          
        </ComuPostedBox>
      </LayoutBox>

      <CommentInputBox
        mode={mode}
        newText={newText}
        setNewText={setNewText}

        showCommentEditBox={showCommentEditBox}
        showReplyInputBox={showReplyInputBox}
        showReplyEditBox={showReplyEditBox}

        handlePostComment={handlePostComment}
        handlePatchComment={handlePatchComment}
      />
      
      <CommentList
        postData={{
          ...postData,
          comment_list: postData.comment_list ? 
          [...postData.comment_list].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).reverse() : 
          [],
        }}
        mode={mode}
        setMode={setMode}

        newText={newText}
        setNewText={setNewText}
        replyText={replyText}
        setReplyText={setReplyText}
        selectedTextId={selectedTextId}
        setSelectedTextId={setSelectedTextId}

        showCommentEditBox={showCommentEditBox}
        setShowCommentEditBox={setShowCommentEditBox}
        showReplyInputBox={showReplyInputBox}
        setShowReplyInputBox={setShowReplyInputBox}
        showReplyEditBox={showReplyEditBox}
        setShowReplyEditBox={setShowReplyEditBox}

        handlePatchComment={handlePatchComment}
        handlePostReply={handlePostReply}
        handlePatchReply={handlePatchReply}
        handleDeleteComment={handleDeleteComment}
        handleDeleteReply={handleDeleteReply}
        getRepliesForComment={getRepliesForComment}

        onCancel={handleCancel}
      />
    </Wrapper>
  )
}

const Wrapper = styled.View`
  flex: 1;
  background-color: #f8f8f8;
`;

const ComuPostedHeader = styled.View`
  border-width: 1px;
  border-color: #DBDBDB;
  background-color: #fff;
  width: 100%;
  height: 42px;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 13px;
`;

const LayoutBox = styled.View``;

const ScreenTitleWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

const ScreenTitle = styled.Text`
  font-family: 'Inter-Bold';
  font-size: 17px;
`;

const ComuPostedBox = styled.View`
  justify-content: center;
  background-color: #fff;
  padding-top: 15px;
  padding-bottom: 15px;
`;

const WriterInfoBox = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
  justify-content: space-between;
  width: 100%;
`;

const WriterNameWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const WriterName = styled.Text`
  font-family: 'Inter-Bold';
  font-size: 15px;
`;

const DateTime = styled.Text`
  color: #AAAAAA;
  font-size: 11px;
`;

const PostContents = styled.View`
  width: 100%;
  padding-top: 10px;
  padding-right: 25px;
  padding-left: 25px;
`;

const PostTitle = styled.View`
  width: 100%;
  justify-content: center;
`;

const PostTitleText = styled.Text`
  font-family: 'Inter-Bold';
  font-size: 18px;
`;

const PostData = styled.View`
  margin-top: 10px;
`;

const PostDataText = styled.Text`
  font-family: 'Inter-Regular';
  font-size: 13px;
`;

const PostFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 2px;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 10px;
`;

const ImageWrapper = styled.ScrollView`
  flex-direction: row;
  height: ${({hasImages}) => (hasImages ? 'auto' : '25px')};
  padding-top: 10px;
  padding-bottom: 10px;
`;

const PostImage = styled.Image`
  flex-direction: row;
  width: 92px;
  height: 92px;
  border-radius: 13px;
  border-width: 1px;
  border-color: #D9D9D9;
  margin-left: ${({ isFirst }) => (isFirst ? '25px' : '0px')};
  margin-right: ${({ isLast }) => (isLast ? '25px' : '13px')};
  z-index: 1;
`;

const IconWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LikeIcon = styled.TouchableOpacity``;

const ChatIcon = styled.TouchableOpacity``;

const LikeCount = styled.Text`
  color: #E05936;
  margin-right: 5px;
  margin-left: 2px;
  font-size: 14px;
`;

const ChatCount = styled.Text`
  color: #8892F7;
  font-size: 14px;
  margin-right: 3px;
  margin-left: 2px;
`;

const ButtonWrapper = styled.View`
  flex-direction: row;
  gap: 10px;
`;

const EditDeleteButton = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #D9D9D9;
  border-radius: 18px;
  width: 53px;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  padding-bottom: 2px;
`;

const ButtonText = styled.Text`
  font-family: 'Inter-Bold';
  font-size: 11px;
  margin-right: 2px;
`;
const UserImage = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
`;