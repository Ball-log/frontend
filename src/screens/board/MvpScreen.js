import React, { useState, useEffect } from "react";
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

const MVPScreen = () => {
  const [playerId, setPlayerId] = useState(0);
  const [playerRecord, setPlayerRecord] = useState("");
  const [gameDate, setGameDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [images, setImages] = useState([]);
  const [playerImage, setPlayerImage] = useState(null); // 선수 이미지 상태 추가
  const [showTextOptions, setShowTextOptions] = useState(false);
  const [showLineSpacingOptions, setShowLineSpacingOptions] = useState(false);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [showSizeOptions, setShowSizeOptions] = useState(false); // 추가된 상태
  const [textStyle, setTextStyle] = useState({});
  const [textAlign, setTextAlign] = useState("left");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(13);

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

  const handleConfirm = (date) => {
    setGameDate(date);
    setDatePickerVisibility(false);
  };

  const pickPlayerImage = async () => {
    console.log("pickPlayerImage function called");
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets ? result.assets[0].uri : result.uri;
        setPlayerImage(uri);
        setPlayerContent((prevContent) => `${prevContent}\n![Image](${uri})`);
      }
    } catch (error) {
      console.error("Error picking player image:", error);
    }
  };

  useEffect(() => {
    console.log("Player images:", images); // 상태 확인용 로그
  }, [images]);

  const pickImages = async () => {
    console.log("pickImages function called");
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

  const handleRemovePlayerImage = () => {
    setPlayerImage(null);
  };

  const toggleTextOptions = () => {
    setShowTextOptions(!showTextOptions);
    setShowLineSpacingOptions(false);
    setShowColorOptions(false);
    setShowSizeOptions(false); // 사이즈 옵션 숨기기
  };

  const toggleLineSpacingOptions = () => {
    setShowLineSpacingOptions(!showLineSpacingOptions);
    setShowTextOptions(false);
    setShowColorOptions(false);
    setShowSizeOptions(false); // 사이즈 옵션 숨기기
  };

  const toggleColorOptions = () => {
    setShowColorOptions(!showColorOptions);
    setShowTextOptions(false);
    setShowLineSpacingOptions(false);
    setShowSizeOptions(false); // 사이즈 옵션 숨기기
  };

  const toggleSizeOptions = () => {
    setShowSizeOptions(!showSizeOptions);
    setShowTextOptions(false);
    setShowLineSpacingOptions(false);
    setShowColorOptions(false); // 색상 옵션 숨기기
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
            placeholder="선수 이름을 입력하세요"
            value={playerId}
            onChangeText={setPlayerId}
          />
          <PlayerContainer>
            {playerImage ? (
              <>
                <ImagePreview source={{ uri: playerImage }} />
                <RemoveImageButton onPress={handleRemovePlayerImage}>
                  <AntDesign name="delete" size={24} color={colors.icon} />
                </RemoveImageButton>
              </>
            ) : (
              <>
                <PlayerText>선수 사진을 업로드 하세요.</PlayerText>
                <PlayerButton onPress={pickPlayerImage}>
                  <Feather name="camera" size={24} color={colors.icon} />
                </PlayerButton>
              </>
            )}
          </PlayerContainer>
          <ResultContainer>
            <ResultButton onPress={() => setDatePickerVisibility(true)}>
              <ResultText>
                {gameDate
                  ? gameDate.toLocaleString()
                  : "경기 결과를 추가하세요."}
              </ResultText>
              <FontAwesome5 name="calendar-alt" size={24} color={colors.icon} />
            </ResultButton>
          </ResultContainer>
          <ContentInput
            placeholder="오늘의 기록을 입력하세요."
            value={playerRecord}
            onChangeText={setPlayerRecord}
            multiline
            color={textColor}
            style={{
              textAlign,
              fontSize: textSize,
              color: textColor,
              fontWeight: textStyle.bold ? "bold" : "normal",
              fontStyle: textStyle.italic ? "italic" : "normal",
              textDecorationLine: textStyle.underline ? "underline" : "none",
            }} // 적용된 글자색 및 크기
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />
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

const PlayerContainer = styled.View`
  flex-direction: row;
  padding: 16px;
  border: 1px solid ${colors.border};
  border-radius: 16px;
  margin-bottom: 16px;
  justify-content: space-between;
  align-items: center;
`;

const PlayerText = styled.Text`
  font-size: ${fonts.sizes.small};
  font-weight: ${fonts.weights.bold};
  color: #b4b4b4;
`;

const PlayerButton = styled.TouchableOpacity`
  flex-direction: row;
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

export default MVPScreen;
