import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/native";
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Context } from '../../context/context';
import CommentInputBox from "./CommentInputBox";
import CommentList from "./CommentList";

const CommentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { comment_context, community_context, reply_context, postData } = useContext(Context);
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
    return postData.reply_list
      .filter((reply) => reply.commented_id === commentId)
      .reverse();
  };

  const handlePostComment = async () => {
    if (!newText.trim()) return;
    try {
      Keyboard.dismiss();
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
      Keyboard.dismiss();
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
              댓글 {postData ? postData.comment_count : "Loading..."}
            </CommentText>
          </CommentWrapper>
        </CommentHeader>

        <CommentList
          postData={postData}
          mode={mode}
          replyText={replyText}
          setReplyText={setReplyText}
          selectedTextId={selectedTextId}
          setSelectedTextId={setSelectedTextId}
          setMode={setMode}
          showReplyInputBox={showReplyInputBox}
          setShowReplyInputBox={setShowReplyInputBox}
          handlePostReply={handlePostReply}
          handlePatchReply={handlePatchReply}
          handleDeleteComment={handleDeleteComment}
          handleDeleteReply={handleDeleteReply}
          getRepliesForComment={getRepliesForComment}
          inverted
        />
        
        <CommentInputBox
          mode={mode}
          newText={newText}
          setNewText={setNewText}
          showReplyInputBox={showReplyInputBox}
          handlePostComment={handlePostComment}
          handlePatchComment={handlePatchComment}
        />

      </KeyboardAvoidingView>
    </Wrapper>
  );
};
const Wrapper = styled.View`
  flex: 1;
  background: #fff;
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

export default CommentScreen;