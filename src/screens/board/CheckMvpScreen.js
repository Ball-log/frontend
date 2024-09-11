import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components/native";
import {
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
  Image
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import { colors, fonts } from "../../global";
import { Context } from '../../context/context';

const CheckMVP = () => {
  const [showButtons, setShowButtons] = useState(false);
  const { board_context, myPage, postByDate, postData } = useContext(Context);

  const createdDate = postData
    ? postData.match_info.match_date.split("T")[0]
    : "Loading...";

  const gameDate = postData
    ? new Date(postData.created_at).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      })
    : "Loading...";

  const navigation = useNavigation();
  const route = useRoute();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSettingsPress = () => {
    setShowButtons((prev) => !prev);
  };

  const handleDeletePress = () => {
    Alert.alert(
      "삭제 확인",
      "정말로 삭제하시겠습니까?",
      [
        {
          text: "취소",
          onPress: () => console.log("삭제 취소"),
          style: "cancel",
        },
        {
          text: "삭제",
          onPress: () => {
            console.log("삭제 요청 전송");

            axios({
              method: "delete",
              url: `${apiUrl}/board/post/${post_id}`,
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              data: {
                post_type: "mvp", // 요청 본문 데이터 추가
              },
            })
              .then((response) => {
                console.log("삭제 성공:", response.status);
                console.log("삭제 응답 데이터:", response.data);

                if (response.status === 200 || response.status === 204) {
                  // 서버에서 삭제 성공 응답이 반환되었는지 확인
                  Alert.alert("성공", "게시글이 삭제되었습니다.");
                  navigation.goBack(); // 삭제 후 이전 화면으로 돌아가기
                } else {
                  Alert.alert("오류", "게시글 삭제에 실패했습니다.");
                }
              })
              .catch((error) => {
                if (error.response) {
                  console.error("삭제 에러 응답 상태:", error.response.status);
                  console.error("삭제 에러 응답 데이터:", error.response.data);
                  Alert.alert("오류", "게시글 삭제에 실패했습니다.");
                } else if (error.request) {
                  console.error("삭제 에러 요청:", error.request);
                  Alert.alert("오류", "서버와 연결할 수 없습니다.");
                } else {
                  console.error("삭제 에러 메시지:", error.message);
                  Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
                }
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Wrapper>
      <UserHeader>
        <BackButton onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </BackButton>
        <UserWrapper>
          <FileIcon source={require("../../assets/Order.png")} />
          <UserName>{postData ? postData.user_name : "Loading..."}</UserName>
        </UserWrapper>
      </UserHeader>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <SettingWrapper>
            <SettingButton onPress={handleSettingsPress}>
              <SettingIcon source={require("../../assets/Settings.png")} />
            </SettingButton>
          </SettingWrapper>
          {showButtons && (
            <ButtonWrapper>
              <EditDeleteButton onPress={() => navigation.navigate("Modify")}>
                <ButtonText>수정</ButtonText>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={13}
                  color="black"
                />
              </EditDeleteButton>
              <EditDeleteButton onPress={handleDeletePress}>
                <ButtonText>삭제</ButtonText>
                <Feather name="trash-2" size={13} color="black" />
              </EditDeleteButton>
            </ButtonWrapper>
          )}

          <TitleWrapper>
            <UserTypeWrapper>
              <UserType>오늘의 MVP</UserType>
            </UserTypeWrapper>
            <DateTime>{createdDate}</DateTime>
            {console.log("uri, ", postData.player_profile_img)}
            <MVPImage source={{uri: postData.player_profile_img }} />
          </TitleWrapper>
          <ScoreWrapper>
            <ScoreDate>
              <DateText>{gameDate} 경기</DateText>
            </ScoreDate>
            <ResultText>{postData.player_record}</ResultText>
          </ScoreWrapper>
          <PostFooter>
            <IconWrapper>
              <LikeIcon onPress={"tedt"}>
                <AntDesign name="hearto" size={21} color="#E05936" />
              </LikeIcon>
              <LikeCount>{postData.like_count}</LikeCount>
              <ChatIcon
                onPress={() => navigation.navigate("Comment", {type: "mvp"})}
              >
                <MaterialCommunityIcons
                  name="message-reply-outline"
                  size={21}
                  color="#8892F7"
                />
              </ChatIcon>
              <ChatCount>
                {postData ? postData.comment_count : "Loading..."}
              </ChatCount>
            </IconWrapper>
            <BookmarkButton>
              <BookmarkImage source={require("../../assets/Bookmark.png")} />
            </BookmarkButton>
          </PostFooter>
        </Container>
      </ScrollView>

      <CommentsFooter>
        <InputBoxWrapper>
          <UserImage source={require("../../assets/Profile.png")} />
          <CommentInputBox
            placeholder="댓글을 입력해주세요"
            placeholderTextColor={"#B5B5B5"}
            multiline
          />
          <UploadButton>
            <Feather name="send" size={24} color="#C51E3A" />
          </UploadButton>
        </InputBoxWrapper>
      </CommentsFooter>
    </Wrapper>
  );
};

const Wrapper = styled.View`
  flex: 1;
  background: white;
`;

const UserHeader = styled.View`
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

const UserWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const FileIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const UserName = styled.Text`
  font-family: "Inter-Bold";
  font-size: 17px;
  margin: 2px 0 0 4px;
`;

const Container = styled.View`
  flex: 1;
`;

const SettingWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding: 5px 10px 0 0;
`;

const SettingButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
`;

const SettingIcon = styled.Image`
  width: 100%;
  height: 100%;
`;

const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding: 5px 10px 0 0;
  gap: 10px;
`;

const EditDeleteButton = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #d9d9d9;
  border-radius: 18px;
  width: 53px;
  height: 25px;
  justify-content: center;
  align-items: center;
  padding: 2px 0;
`;

const ButtonText = styled.Text`
  font-family: "Inter-Bold";
  font-size: 11px;
  margin-right: 2px;
`;

const TitleWrapper = styled.View`
  align-items: center;
`;

const UserTypeWrapper = styled.View`
  align-self: center;
  border: 1px solid ${colors.primary};
  margin: 20px 0 8px 0;
  border-radius: 23px;
`;

const UserType = styled.Text`
  color: ${colors.primary};
  padding: 4px 12px;
  justify-content: center;
  font-size: ${fonts.sizes.small};
  font-weight: ${fonts.weights.bold};
`;

const DateTime = styled.Text`
  color: #aaaaaa;
  font-size: 11px;
  margin-bottom: 20px;
`;

const MVPImage = styled.Image`
  margin-bottom: 20px;
  width: 100px; /* 원하는 너비로 설정 */
  height: 100px; /* 원하는 높이로 설정 */
`;

const ScoreWrapper = styled.View`
  align-items: center;
  height: 100px;
  width: 100%;
  background-color: rgba(217, 217, 217, 0.21);
  padding: 20px;
`;

const ScoreDate = styled.View`
  width: 96px;
  height: 23px;
  color: black;
  border: 1.5px solid black;
  border-radius: 20px;
  justify-content: center;
  margin-bottom: 10px;
`;

const DateText = styled.Text`
  text-align: center;
  font-size: 12px;
  color: black;
  font-weight: 900;
`;

const ResultText = styled.Text`
  text-align: center;
  font-size: 13px;
  font-weight: 700;
`;

const PostFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 10px;
`;

const IconWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: 36px;
  font-size: 16px;
`;

const LikeIcon = styled.TouchableOpacity``;

const ChatIcon = styled.TouchableOpacity``;

const LikeCount = styled.Text`
  color: #ff4a22;
  margin: 0 5px;
`;

const ChatCount = styled.Text`
  color: #7c91ff;
  margin: 0 5px;
`;

const BookmarkButton = styled.TouchableOpacity``;

const BookmarkImage = styled.Image`
  width: 30px;
  height: 30px;
`;

const CommentsFooter = styled.View`
  position: absolute;
  height: 80px;
  bottom: 0px;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding-left: 13px;
  padding-right: 13px;
  background-color: #fff;
`;

const InputBoxWrapper = styled.View`
  flex-direction: row;
  padding-right: 15px;
  padding-left: 15px;
  align-items: center;
  justify-content: space-between;
  border-radius: 36px;
  border-color: #c51e3a;
  border-width: 1px;
  width: 100%;
  height: 48px;
`;

const UserImage = styled.Image`
  width: 28.52px;
  height: 28.52px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

const CommentInputBox = styled.TextInput`
  font-family: "Inter-Regular";
  width: 84%;
  padding-top: 8px 10px;
`;

const UploadButton = styled.TouchableOpacity``;

export default CheckMVP;
