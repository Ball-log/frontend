//ComuPostedScreen.js
import React, {useState, useContext, useMemo, useRef, useEffect} from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Context } from '../../context/context';
import CommentBody from '../comment/CommentBody'

export default function ComuPostedScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { post_like_context, community_context, postData } = useContext(Context);
  const [selectedType, setSelectedType] = useState(type);
  const [showModal, setShowModal] = useState(false);
  const {post_id, type} = route.params;
  useEffect(() => {
    const setPostData = async () => {
      await community_context.get(post_id);
      setSelectedType(type)
    };
    setPostData()
  }, [])
  useEffect(() => {
    const setPostData = async () => {
      await community_context.get(post_id);
      setSelectedType(type)
    };
    setPostData()
  }, [route])
  const inputRef = useRef(null);

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


  const closeModal = () => {
    setShowModal(false);
    setModalType('');
  };

  const confirmReply = () => {
    closeModal();
    if (inputRef.current) {
      inputRef.current.focus(); //작성 버튼 클릭 시 포커스
      Keyboard.addListener('keyboardDidShow', () => {}); //키보드 활성화
    }
    handleReplySubmit();
  }

  return (
    <TouchableWithoutFeedback>
    <Wrapper>

      <ComuPostedHeader>
        <BackButton onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </BackButton>
        <ScreenTitleWrapper>
          <ScreenTitle>{selectedType === 'league' ? ('리그 커뮤니티') : ('마이팀 커뮤니티')}</ScreenTitle>
        </ScreenTitleWrapper>
      </ComuPostedHeader>

      <ScrollContainer>
        <ComuPostedBox>
          <WriterInfoBox>
            <WriterNameWrapper>
              <UserImage source={{uri: postData.user_icon_url}} />
              <WriterName>{postData.user_name || '사용자'}</WriterName>
            </WriterNameWrapper>
            <DateTime>{`${post.created_at.split(" ")[0]} ${post.created_at.split(" ")[1]}`}</DateTime>
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
          {postData.img_urls.map((url, index) => (
            <PostImage 
              key={`${url}url`} 
              source={{uri: url}} 
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
              <ChatIcon
                onPress={() => navigation.navigate("Comment", {type:type} )}
              >
                <MaterialCommunityIcons
                  name="message-reply-outline"
                  size={21}
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
          <LayoutBox>
          
        </LayoutBox>
        <CommentBody/>
      </ScrollContainer>
      
    </Wrapper>
    
    </TouchableWithoutFeedback>
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

const ScrollContainer = styled.ScrollView`
  margin-bottom: 80px;
`;

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

const LayoutBox = styled.View``;
