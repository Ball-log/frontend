const CommentBody = () => {

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