// MyPost.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import ModalComponent from "../../components/Modal";
import { Context } from '../../context/context';

const MyPostScreen = () => {
  const { myPage_context, myPage, postByDate } = useContext(Context);
  const [miniModalVisible1, setMiniModalVisible1] = useState(false);
  const [miniModalVisible2, setMiniModalVisible2] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  console.log(postByDate)
  const navigateBack = () => {
    navigation.goBack();
  };
  const onPressHandler1 = () => {
    setMiniModalVisible1(true);
  };
  const onPressHandler2 = () => {
    setMiniModalVisible2(true);
  };
  const handleModify = () => {
    setMiniModalVisible1(false);
    setMiniModalVisible2(false);
    setModalVisible(true);
  };
  const handleDelete = () => {
    setMiniModalVisible1(false);
    setMiniModalVisible2(false);
    setModalVisible(true);
  };
  const handleConfirm = () => {
    setModalVisible(false);
  };
  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>내가 쓴 글</Text>
        </View>
      </View>
      
      {postByDate.blog_list.map((blog) => (
        <View style={styles.BlogContainer} key={blog.blog_id}>
          <TouchableOpacity
            style={styles.BlogButton}
            onPress={() => navigation.navigate("CheckBlog")}
          >
            <View style={styles.Tab}>
              <Text style={styles.TabText}>BLOG</Text>
              <Text style={styles.TabText}>{blog.blog_created_at}</Text>
            </View>
            <Image
              style={styles.BlogImage}
              source={{uri: blog.blog_thumbnail}}
            />
            <View style={styles.TextContainer}>
              <View style={styles.LeftContainer}>
                <Image
                  style={styles.ProfileImage}
                  source={{uri: myPage.user_icon_url}}
                />
                <View style={styles.Texts}>
                  <Text style={styles.mainText}>{blog.blog_title}</Text>
                  <Text style={styles.subText}>
                    조회수 : 8회 | 18 : 06 업로드
                  </Text>
                </View>
              </View>

              <View style={styles.Set_IconContainer}>
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={onPressHandler1}
                >
                  <Ionicons
                    name="ellipsis-horizontal-sharp"
                    size={18}
                    color="black"
                  />
                </TouchableOpacity>
                <View style={styles.IconWrapper} >
                  <TouchableOpacity onPress={navigateBack}>
                    <AntDesign name="hearto" size={12} color="#E05936" />
                  </TouchableOpacity>
                  <Text style={styles.LikeCount}>{blog.blog_count_like}</Text>
                  <MaterialCommunityIcons
                    name="message-reply-outline"
                    size={12}
                    color="#8892F7"
                  />
                  <Text style={styles.ChatCount}>{blog.blog_count_comment}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ))}
        
      {postByDate.mvp_list.map((mvp) => (
        <View style={styles.MvpContainer} key={mvp.mvp_id}>
          <TouchableOpacity
            style={styles.BlogButton}
            onPress={() => navigation.navigate("CheckMVP")}
          >
            <View style={styles.Tab}>
              <Text style={styles.TabText}>MVP</Text>
              <Text style={styles.TabText}>{mvp.mvp_created_at}</Text>
            </View>
            <View style={styles.MvpBody}>
              <Image
                style={styles.MvpImage}
                source={{uri: mvp.mvp_player_profile }}
              />
              <View style={styles.MvpBodyRight}>
                <View style={styles.MvpBody_1}>
                  <View style={styles.TeamName}>
                    <Image
                      style={styles.TeamLogoImage}
                      source={{uri: myPage.user_team_icon_flag}}
                    />
                    <Text style={styles.MvpName}>{mvp.mvp_player_name}</Text>
                  </View>
                  <View style={styles.settingButtonCon}>
                    <TouchableOpacity
                      style={styles.settingButton}
                      onPress={onPressHandler2}
                    >
                      <Ionicons
                        name="ellipsis-horizontal-sharp"
                        size={18}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.MvpBody_2}>
                  <Text style={styles.TodayText}>오늘의 기록</Text>
                  <Text>{mvp.mvp_player_record}</Text>
                </View>
                <View style={styles.MvpBody_3}>
                  <Text style={styles.subText}>
                    조회수 : 8회 | 18 : 06 업로드
                  </Text>
                  <View style={styles.IconWrapper}>
                    <TouchableOpacity
                      style={styles.LikeButton}
                      onPress={navigateBack}
                    >
                      <AntDesign name="hearto" size={12} color="#E05936" />
                    </TouchableOpacity>
                    <Text style={styles.LikeCount}>{mvp.mvp_count_like}</Text>
                    <MaterialCommunityIcons
                      name="message-reply-outline"
                      size={12}
                      color="#8892F7"
                    />
                    <Text style={styles.ChatCount}>{mvp.mvp_count_comment}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ))}

      <ModalComponent
        isVisible={miniModalVisible1}
        onClose={() => setMiniModalVisible1(false)}
        onModify={handleModify}
        onDelete={handleDelete}
        position={{
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: 0,
        }} // 위치 조정
      />

      <ModalComponent
        isVisible={miniModalVisible2}
        onClose={() => setMiniModalVisible2(false)}
        onModify={handleModify}
        onDelete={handleDelete}
        position={{
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: 95,
        }} // 다른 위치 조정
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>삭제하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.modalButtonText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 12,
    marginBottom: 12,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    marginHorizontal: 13,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  BlogContainer: {
    flex: 1,
    width: "100%",
  },
  Tab: {
    height: 28,
    flexDirection: "row",
    backgroundColor: "#C51E3A",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  TabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  BlogImage: {
    width: "100%",
    height: 240,
  },
  TextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 5,
  },
  LeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ProfileImage: {
    width: 37,
    height: 37,
  },
  Texts: {
    marginHorizontal: 7,
  },
  mainText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 3,
  },
  subText: {
    fontSize: 7,
    fontWeight: "600",
  },
  Set_IconContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  settingButton: {
    marginRight: 5,
  },
  IconWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  LikeCount: {
    color: "#E05936",
    fontSize: 14,
    marginRight: 5,
    marginLeft: 2,
  },
  ChatCount: {
    color: "#8892F7",
    fontSize: 14,
    marginRight: 5,
    marginLeft: 2,
  },

  MvpContainer: {
    flex: 1,
    width: "100%",
  },
  MvpBody: {
    flexDirection: "row",
  },
  MvpImage: {
    width: "50%",
  },
  MvpBodyRight: {
    width: "50%",
    flexDirection: "column",
  },
  MvpBody_1: {
    flexDirection: "row",
    padding: 10,
    paddingRight: 5,
    height: 95,
    justifyContent: "space-between",
    alignItems: "center",
  },
  TeamName: {
    flexDirection: "row",
  },
  TeamLogoImage: {
    width: 35,
    height: 50,
  },
  MvpName: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
    marginTop: 10,
  },
  settingButtonCon: {
    width: 35,
    height: 50,
    alignItems: "flex-end",
  },
  MvpBody_2: {
    height: 95,
    padding: 10,
    paddingVertical: 25,
    justifyContent: "space-between",
  },
  TodayText: {
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 8,
    padding: 3,
    width: 45,
    textAlign: "center",
  },
  MvpBody_3: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 10,
    height: 95,
  },

  modalOverlay: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    width: 154,
    height: 42,
    borderRadius: 44,
    margin: 5,
    backgroundColor: "#C51E3A",
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  confirmButton: {
    backgroundColor: "#C51E3A",
  },
});

export default MyPostScreen;
