import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Context } from '../../context/context';
import { myPage_api } from "../../api/myPage/myPage.api";

const MyPageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { myPage_context, myPage, postByDate } = useContext(Context);
  const selectedTeam = route.params?.team;
  const profileImgUrl = route.params?.profileImgUrl;
  const backgroundImage = data?.opposition_icon_flag
    ? { uri: data.user_background_img }
    : require("../assets/basic.png"); // 기본 이미지

  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        await myPage_context.get()
      } catch (error) {
        if (error.response) {
          // 서버가 응답을 반환한 경우 (상태 코드가 2xx 범위 밖인 경우)
          console.error("Error fetching data!!:", error.response.data);
          console.error("Status code:", error.response.status);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          // 요청이 전송되었으나 응답을 받지 못한 경우
          console.error("Error request:", error.request);
        } else {
          // 요청을 설정하는 동안 발생한 다른 오류
          console.error("Error message:", error.message);
        }
        console.error("Error config:", error.config);
      }
    };
    fetchData(); // 컴포넌트 마운트 시 데이터 가져오기
  }, []);
  const [data, setData] = useState({user_name:"test"}); // 데이터 상태
  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // 월 (0-11이므로 +1)
    const day = date.getDate(); // 일
    return `${month}/${day}일 경기`;
  };

  console.log('profileImgUrl', profileImgUrl);

  const onPressHandler = () => {
    navigation.navigate("SettingScreen", {data});
  };

  const onDayPress = (day) => {
    const selectedDate = day.dateString;
    
    const isRedDate =
      markedDates[selectedDate] &&
      markedDates[selectedDate].selectedColor === "#E8A5B0";
    if (isRedDate) {
      navigation.navigate("MyPostScreen");
    }
  };
  const redDates = data && data.writed_date_list ? data.writed_date_list : [];
  console.log("Fetched redDates:", redDates);
  const today = new Date().toISOString().split("T")[0];

  const markedDates = redDates.reduce((acc, date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0]; // 날짜 형식을 YYYY-MM-DD로 변환
    acc[formattedDate] = {
      selected: true,
      selectedColor: "#E8A5B0",
    };
    return acc;
  }, {});
  console.log("Fetched markDates:", markedDates);

  markedDates[today] = { selected: true, selectedColor: "#CDCDCD" };

  console.log('내 팀: ', selectedTeam);
  console.log('data', data);

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.BasicImage}>
        {selectedTeam && (
          <Image style={styles.TeamImage} source={selectedTeam.image} />
        )}
        <TouchableOpacity
          style={styles.SettingImageButton}
          onPress={onPressHandler}
        >
          <Image
            style={styles.SettingImage}
            source={require("../assets/Setting.png")}
          />
        </TouchableOpacity>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={onPressHandler}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.ProfileImage}
                source={{uri: profileImgUrl || data.user_icon_url}}
              />
            </View>
            <Text style={styles.buttonText}>{data.user_name}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              style={styles.image}
              source={require("../assets/Bookmark.png")}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.ScoreContainer}>
        <View style={styles.ScoreResult}>
          <View style={styles.ScoreDate}>
            <Text style={styles.Date}>{formatMatchDate(today)}</Text>
          </View>
          <Text style={styles.Result}>
            {data?.user_team_score === null && data?.opposition_score === null
              ? " " // 두 값이 모두 null인 경우 빈 문자열을 출력
              : data?.user_team_score > data?.opposition_score
              ? "승"
              : "패"}
          </Text>

        </View>
        <View style={styles.Score}>
          <Image
            style={styles.ScoreImage}
            source={{ uri: data?.opposition_icon_flag }}
          >
            {/* user_team_icon_flag로 수정 필요, 데이터 부족 */}
          </Image>
          {data &&
          data.user_team_score !== null &&
          data.opposition_score !== null ? (
            <Text style={styles.ScoreNum}>
              {data.user_team_score} : {data.opposition_score}
            </Text>
          ) : (
            <Text style={styles.ScoreNone}>오늘의 경기는 없습니다</Text>
          )}
          <Image
            style={styles.ScoreImage}
            source={{ uri: data?.opposition_icon_flag }}
          ></Image>
        </View>
      </View>
      <View style={styles.calendarContainer}>
        <ScrollView>
          <Calendar
            style={styles.calendar}
            theme={calendarTheme}
            onDayPress={onDayPress}
            hideExtraDays={true}
            monthFormat={"yyyy / MM"}
            onMonthChange={(month) => {
              console.log(month);
            }}
            renderArrow={(direction) =>
              direction === "left" ? (
                <Image
                  style={styles.arrow}
                  name="left"
                  size={20}
                  source={require("../assets/LeftVector.png")}
                />
              ) : (
                <Image
                  style={styles.arrow}
                  name="right"
                  size={20}
                  source={require("../assets/RightVector.png")}
                />
              )
            }
            markedDates={markedDates}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  BasicImage: {
    height: 327,
    width: "100%",
  },
  TeamImage: {
    width: 62,
    height: 75,
    borderRadius: 1,
    margin: 10,
    position: "absolute",
    right: 10,
    top: 20,
  },
  SettingImageButton: {
    height: 27,
    width: 27,
    marginTop: 220,
    marginLeft: 24,
    marginBottom: 10,
  },
  SettingImage: {
    height: 27,
    width: 27,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#fff",
    width: 146,
    height: 45,
    borderRadius: 30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  imageContainer: {
    marginHorizontal: 7,
  },
  ProfileImage: {
    width: 37,
    height: 37,
    resizeMode: "cover",
    borderRadius: 100,
  },
  image: {
    resizeMode: "cover",
    width: 44,
    height: 44,
  },
  buttonText: {
    flex: 1,
    fontWeight: "600",
    fontSize: 23,
    textAlign: "center",
  },
  ScoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 98,
    width: "100%",
  },
  ScoreResult: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  ScoreDate: {
    width: 96,
    height: 23,
    backgroundColor: "#C51E3A",
    borderRadius: 20,
    justifyContent: "center",
    marginBottom: 10,
  },
  Date: {
    textAlign: "center",
    fontSize: 13,
    color: "#FFFFFF",
  },
  Result: {
    color: "#C51E3A",
    fontSize: 26,
    fontWeight: "600",
  },
  Score: {
    width: 230,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ScoreImage: {
    width: 59,
    height: 71,
  },

  ScoreNone: {
    fontSize: 15,
    fontWeight: "600",
  },
  calendarContainer: {
    flex: 1,
    width: "100%",
  },
  calendar: {
    marginTop: 2,
    marginBottom: 5,
  },
  arrow: {
    resizeMode: "cover",
    width: 6,
    height: 12,
  },
});

const calendarTheme = {
  todayTextColor: "black",
  textDayFontSize: 15,
  textDayFontWeight: "bold",
  textMonthFontSize: 15,
  textMonthFontWeight: "bold",
  textSectionTitleColor: "rgba(138, 138, 138, 1)",
};

export default MyPageScreen;