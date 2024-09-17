import React, { useState, useEffect, useContext } from "react";
import { Modal, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import styled from "styled-components/native";
import { colors, fonts } from "../../global";

import {
  AntDesign,
  FontAwesome5,
  Feather,
  Ionicons,
  FontAwesome,
  Fontisto,
  FontAwesome6,
} from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import {
  Text,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Context } from '../../context/context';

const BlogScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [matchDate, setMatchDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [images, setImages] = useState([]);
  const [showTextOptions, setShowTextOptions] = useState(false);
  const [showLineSpacingOptions, setShowLineSpacingOptions] = useState(false);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [showSizeOptions, setShowSizeOptions] = useState(false);
  const [textStyle, setTextStyle] = useState({});
  const [textAlign, setTextAlign] = useState("left");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(13);

  const { info_context, matchInfo, selectedMatch, setSelectedMatch } = useContext(Context);
  const [modalVisible, setModalVisible] = useState(false)


  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(
          "죄송합니다. 이 기능을 사용하려면 사진 보관함 접근 권한이 필요합니다."
        );
      }
    })();
  }, []);

  const handleConfirm =  async (date) => {
    await info_context.get_match_info(date.toLocaleDateString('en-CA'))
    setModalVisible(true)
    setMatchDate(date);
    setDatePickerVisibility(false);
  };

  const pickImages = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true, // 여러 이미지 선택 허용
        quality: 1,
      });

      if (!result.canceled) {
        const uris = result.assets.map((asset) => asset.uri);
        setImages((prevImages) => [...prevImages, ...uris]);
      }
    } catch (error) {
      console.error("Error picking images:", error);
    }
  };

  useEffect(() => {
    console.log("Current images:", images); // 상태 확인용 로그
  }, [images]);
  const handleRemoveImage = (uri) => {
    setImages((prevImages) => prevImages.filter((image) => image !== uri));
  };

  const toggleTextOptions = () => {
    setShowTextOptions(!showTextOptions);
    setShowLineSpacingOptions(false);
    setShowColorOptions(false);
    setShowSizeOptions(false);
  };

  const toggleLineSpacingOptions = () => {
    setShowLineSpacingOptions(!showLineSpacingOptions);
    setShowTextOptions(false);
    setShowColorOptions(false);
    setShowSizeOptions(false);
  };

  const toggleColorOptions = () => {
    setShowColorOptions(!showColorOptions);
    setShowTextOptions(false);
    setShowLineSpacingOptions(false);
    setShowSizeOptions(false);
  };

  const toggleSizeOptions = () => {
    setShowSizeOptions(!showSizeOptions);
    setShowTextOptions(false);
    setShowLineSpacingOptions(false);
    setShowColorOptions(false);
  };

  const applyStyle = (style) => {
    setTextStyle((prevStyle) => ({
      ...prevStyle,
      [style]: prevStyle[style] ? undefined : style,
    }));
  };

  const applyAlign = (alignment) => {
    setTextAlign(alignment);
  };

  const applyColor = (color) => {
    setTextColor(color);
  };

  const applySize = (size) => {
    setTextSize(size);
  };

  const colorOptions = {
    black: "#000000",
    red: "#FF0000",
    blue: "#00008b",
    yellow: "#FFD300",
    green: "#008000",
  };

  const sizeOptions = {
    h1: 30,
    h2: 25,
    h3: 20,
    h4: 15,
    h5: 10,
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ContentContainer>
          <TitleInput
            placeholder="제목을 입력해주세요."
            value={title}
            onChangeText={setTitle}
          />
          <ResultContainer>
            <ResultButton onPress={() => setDatePickerVisibility(true)}>
              <ResultText>
                {selectedMatch
                  ? `${selectedMatch.home_team_name} ${selectedMatch.home_team_score} : ${selectedMatch.away_team_score} ${selectedMatch.away_team_name}`
                  : "경기 결과를 추가하세요."}
              </ResultText>
              <FontAwesome5 name="calendar-alt" size={24} color={colors.icon} />
            </ResultButton>
          </ResultContainer>
          <ContentInput
            placeholder="오늘의 기록을 입력하세요."
            value={content}
            onChangeText={setContent}
            multiline
            color={textColor}
            style={{
              textAlign,
              fontSize: textSize,
              fontWeight: textStyle.bold ? "bold" : "normal",
              fontStyle: textStyle.italic ? "italic" : "normal",
              textDecorationLine: textStyle.underline ? "underline" : "none",
            }} // 적용된 글자색 및 크기
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />
          <Modal
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            transparent={true} // 배경을 투명하게 설정
          >
            <View style={styles.overlay}>
              <View style={styles.modalContainer}>
                {matchInfo ? matchInfo.map((match, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.Score} 
                    onPress={() => {
                      setModalVisible(false)
                      setSelectedMatch(match)

                      console.log("in modal, match id :", match.match_id)
                    }}
                  >
                    <Image
                      style={styles.ScoreImage}
                      source={{ uri: match.home_team_icon_flag }}
                    ></Image>
                    <Text style={styles.modalButtonText}>
                      {`${match.home_team_name} ${match.home_team_score} : ${match.away_team_score} ${match.away_team_name}`}
                    </Text>
                    <Image
                      style={styles.ScoreImage}
                      source={{ uri: match.away_team_icon_flag }}
                    ></Image>
                  </TouchableOpacity>
                )) : null}
              </View>
            </View>
          </Modal>
          <ElementContainer>
            <PhotoButton onPress={pickImages}>
              <Feather name="camera" size={24} color={colors.icon} />
            </PhotoButton>
            <TextButton onPress={toggleTextOptions}>
              <Ionicons name="text" size={24} color={colors.icon} />
            </TextButton>
            <AlignButton onPress={toggleLineSpacingOptions}>
              <Feather name="align-left" size={24} color={colors.icon} />
            </AlignButton>
            <ColorButton onPress={toggleColorOptions}>
              <Ionicons
                name="color-palette-outline"
                size={24}
                color={colors.icon}
              />
            </ColorButton>
            <SizeButton onPress={toggleSizeOptions}>
              <FontAwesome name="text-height" size={24} color="black" />
            </SizeButton>
          </ElementContainer>
          {showTextOptions && (
            <OptionsContainer>
              <TextBar>
                <OptionText>텍스트 옵션</OptionText>
                <CloseButton onPress={toggleTextOptions}>
                  <AntDesign name="close" size={18} color="#33363f" />
                </CloseButton>
              </TextBar>
              <OptionBar>
                <BorderBox>
                  <OptionButton onPress={() => applyStyle("bold")}>
                    <FontAwesome6 name="bold" size={20} color={colors.icon} />
                  </OptionButton>
                  <OptionButton onPress={() => applyStyle("italic")}>
                    <FontAwesome name="italic" size={20} color={colors.icon} />
                  </OptionButton>
                  <OptionButton onPress={() => applyStyle("underline")}>
                    <Fontisto name="underline" size={20} color={colors.icon} />
                  </OptionButton>
                </BorderBox>
              </OptionBar>
            </OptionsContainer>
          )}
          {showLineSpacingOptions && (
            <OptionsContainer>
              <TextBar>
                <OptionText>텍스트 정렬 옵션</OptionText>
                <CloseButton onPress={toggleLineSpacingOptions}>
                  <AntDesign name="close" size={18} color="#33363f" />
                </CloseButton>
              </TextBar>
              <OptionBar>
                <BorderBox>
                  <OptionButton onPress={() => applyAlign("left")}>
                    <Feather
                      name="align-left"
                      size={20}
                      color={
                        textAlign === "left" ? colors.primary : colors.icon
                      }
                    />
                  </OptionButton>
                  <OptionButton onPress={() => applyAlign("center")}>
                    <Feather
                      name="align-center"
                      size={20}
                      color={
                        textAlign === "center" ? colors.primary : colors.icon
                      }
                    />
                  </OptionButton>
                  <OptionButton onPress={() => applyAlign("right")}>
                    <Feather
                      name="align-right"
                      size={20}
                      color={
                        textAlign === "right" ? colors.primary : colors.icon
                      }
                    />
                  </OptionButton>
                  <OptionButton onPress={() => applyAlign("justify")}>
                    <Feather
                      name="align-justify"
                      size={20}
                      color={
                        textAlign === "justify" ? colors.primary : colors.icon
                      }
                    />
                  </OptionButton>
                </BorderBox>
              </OptionBar>
            </OptionsContainer>
          )}
          {showColorOptions && (
            <OptionsContainer>
              <TextBar>
                <OptionText>색상 옵션</OptionText>
                <CloseButton onPress={toggleColorOptions}>
                  <AntDesign name="close" size={18} color="#33363f" />
                </CloseButton>
              </TextBar>
              <OptionBar>
                <BorderBox>
                  {Object.keys(colorOptions).map((colorName) => (
                    <OptionButton
                      key={colorName}
                      onPress={() => applyColor(colorOptions[colorName])}
                    >
                      <Ionicons
                        name="color-fill"
                        size={24}
                        color={colorOptions[colorName]}
                      />
                    </OptionButton>
                  ))}
                </BorderBox>
              </OptionBar>
            </OptionsContainer>
          )}
          {showSizeOptions && (
            <OptionsContainer>
              <TextBar>
                <OptionText>크기 옵션</OptionText>
                <CloseButton onPress={toggleSizeOptions}>
                  <AntDesign name="close" size={18} color="#33363f" />
                </CloseButton>
              </TextBar>
              <OptionBar>
                <BorderBox>
                  {Object.keys(sizeOptions).map((sizeName) => (
                    <OptionButton
                      key={sizeName}
                      onPress={() => applySize(sizeOptions[sizeName])}
                    >
                      <Text style={{ fontSize: 14 }}>{sizeName}</Text>
                    </OptionButton>
                  ))}
                </BorderBox>
              </OptionBar>
            </OptionsContainer>
          )}
          {images.length > 0 && (
            <ImagePreviewContainer>
              {images.map((uri, index) => (
                <ImagePreviewBox key={index}>
                  <ImagePreview source={{ uri }} />
                  <RemoveImageButton onPress={() => handleRemoveImage(uri)}>
                    <AntDesign name="delete" size={24} color={colors.icon} />
                  </RemoveImageButton>
                </ImagePreviewBox>
              ))}
            </ImagePreviewContainer>
          )}
        </ContentContainer>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const CloseButton = styled.TouchableOpacity``;
const styles = StyleSheet.create({
  overlay: {
    flex: 1, // 전체 화면을 덮도록 설정
    justifyContent: 'center', // 세로 가운데 정렬
    alignItems: 'center', // 가로 가운데 정렬
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검정색 배경
  },
  modalContainer: {
    width: 300,
    height: 400,
    backgroundColor: 'white', // 모달 내부 배경
    borderRadius: 10, // 모서리를 둥글게
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'black',
    fontSize: 16,
  },
  ScoreImage: {
    width: 59,
    height: 71,
  },
  Score: {
    width: 230,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }
});


const ContentContainer = styled.View`
  padding: 16px;
`;

const TitleInput = styled.TextInput`
  font-size: ${fonts.sizes.small};
  font-weight: ${fonts.weights.bold};
  color: ${colors.placeholder};
  padding: 10px 15px;
  border: 1px solid ${colors.border};
  border-radius: 32px;
  margin-bottom: 16px;
`;

const ResultContainer = styled.View`
  border: 1px solid ${colors.border};
  border-radius: 16px;
  margin-bottom: 16px;
`;

const ResultText = styled.Text`
  font-size: ${fonts.sizes.small};
  font-weight: ${fonts.weights.bold};
  color: #b4b4b4;
  flex: 1;
`;

const ResultButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 15px;
  height: 75px;
`;

const ContentInput = styled.TextInput`
  font-size: ${fonts.sizes.small};
  font-weight: ${fonts.weights.bold};
  padding: 10px 15px;
  border: 1px solid ${colors.border};
  border-radius: 14px;
  min-height: 200px;
`;

const ElementContainer = styled.View`
  flex-direction: row;
  padding: 8px;
`;

const PhotoButton = styled.TouchableOpacity`
  padding-right: 10px;
`;

const TextButton = styled.TouchableOpacity`
  padding-right: 8px;
`;

const AlignButton = styled.TouchableOpacity`
  padding-right: 7px;
`;

const ColorButton = styled.TouchableOpacity`
  padding-right: 8px;
`;

const SizeButton = styled.TouchableOpacity``;

const ImagePreviewContainer = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  flex-direction: row;
  margin-top: 10px;
`;

const ImagePreviewBox = styled.View`
  position: relative;
  padding: 16px 16px 0 0;
`;

const ImagePreview = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 8px;
`;

const RemoveImageButton = styled.TouchableOpacity`
  position: absolute;
  top: 3px;
  right: 3px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  padding: 5px;
`;

const OptionsContainer = styled.View`
  flex-direction: column;
  padding: 5px 8px;
  border-radius: 7px;
  border: 1px solid ${colors.border};
`;

const TextBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 8px;
`;

const OptionText = styled.Text`
  font-size: ${fonts.sizes.mini};
  font-weight: ${fonts.weights.light};
`;

const OptionBar = styled.View`
  flex-direction: row;
  padding: 0 0 8px 8px;
`;

const BorderBox = styled.View`
  flex-direction: row;
  background-color: ${colors.border};
  border-radius: 7px;
  padding: 3px;
  margin-right: 10px;
`;

const OptionButton = styled.TouchableOpacity`
  padding: 2px 8px;
`;

export default BlogScreen;
