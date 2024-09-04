import React, { useState, useEffect } from "react";
import { colors } from "../global";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_TOKEN } from "@env";
import { store } from "../utils/secureStore";
import { teamImages } from "../utils/team_images";

const TeamSelect = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedOption, setSelectedOption] = useState(null);
  const [teamData, setTeamData] = useState([]);
  const [token, setToken] = useState(null);

  const profileImgUrl = route.params?.user_icon || route.params?.profileImgUrl;
  console.log('profileImgUrl: ', profileImgUrl);

  useEffect(() => {
    async function getToken() {
      console.log('Component mounted');
      try {
        const token = await store.get("Authorization");
        setToken(token);  // token 값을 상태에 저장
      } catch (error) {
        console.error('Error get token:', error);
      }
    }
    // 비동기 함수 호출
    getToken();

    return () => {
      console.log('Cleanup if necessary');
    };
  }, []);

  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchData = async () => {
      const token = await store.get("Authorization");
      try {
        // 토큰 Bearer을 제외한 부분 넣어야함
        const response = await axios.get(
          "https://api.ballog.store/myPage/setting/teamSetting",
          {
            headers: {
              Authorization: token,
            },
          }
        ); // 실제 API 엔드포인트로 교체

        const result = response.data.result;
        setTeamData(result); // 데이터 설정
        console.log("Fetched data:", response.data.result.length);
      } catch (error) {
        if (error.response) {
          // 서버가 응답을 반환한 경우 (상태 코드가 2xx 범위 밖인 경우)
          console.error("Error fetching data:", error.response.data);
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

  const onPressHandler = async () => {
    if (selectedOption) {
      try {
        await store.save("team_id", String(selectedOption.team_id))
        
        const token = await store.get("Authorization");
        const response = await axios.patch(
          "https://api.ballog.store/myPage/setting/teamSetting",
          {
            team_id: selectedOption.team_id, // 선택된 팀의 ID를 보냄
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log("PATCH response:", response.data);
        
        navigation.navigate("MainTabs", { 
          team: selectedOption,
          user_icon: profileImgUrl
        }); // 성공 시 다음 화면으로 이동
      } catch (error) {
        if (error.response) {
          console.error("Error sending data:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
    } else {
      alert("팀을 선택해주세요!");
    }
  };

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.logo}>Ballog</Text>
        </View>
      </SafeAreaView>
      <View style={styles.contentContainer}>
        <View style={styles.TeamText}>
          <Text style={styles.MyTeam}>My Team</Text>
          <Text style={styles.SelectText}>을 선택하세요</Text>
        </View>
        <ScrollView contentContainerStyle={styles.optionsContainer}>
          {teamData.length === 10 ? (
            teamData.map((team, index) => (
              <TouchableOpacity
                key={team.team_id} // team_id를 key로 사용
                style={[
                  styles.optionButton,
                  selectedOption?.team_id === team.team_id &&
                    styles.selectedOptionButton,
                ]}
                onPress={() => {
                  setSelectedOption(team)
                }} // 팀 선택
              >
                <Text style={styles.optionButtonText}>{team.team_name}</Text>
                <Image
                  source={teamImages[team.team_icon_flag]}
                  style={styles.optionImage}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text>팀 데이터를 불러오는 중...</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={onPressHandler}>
          <Text style={styles.buttonText}>적용</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    paddingHorizontal: 10,
  },
  logo: {
    fontSize: 30,
    fontFamily: 'InterExtraBold',
    color: "#b91d47",
    marginLeft: 10,
  },
  contentContainer: {
    height: 700,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  TeamText: {
    flexDirection: "row",
    marginVertical: 13,
    fontFamily: 'InterBold',
  },

  MyTeam: {
    color: colors.primary,
    fontFamily: 'InterBold',
    fontSize: 27,
  },
  SelectText: {
    fontFamily: 'InterBold',
    fontSize: 26,
  },
  optionsContainer: {
    flexGrow: 1,
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    width: "30%",
    height: 125,
    padding: 5,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  selectedOptionButton: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  optionImage: {
    width: 70,
    height: 95,
    marginBottom: 5,
  },
  optionButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  button: {
    backgroundColor: colors.primary,
    width: "100%",
    height: 55,
    padding: 10,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default TeamSelect;