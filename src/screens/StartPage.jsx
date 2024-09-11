import React from 'react';
import { StatusBar, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../global';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

const StartPage = () => {

    const navigation = useNavigation(); // Initialize navigation

    const onPressHandler = () => {
        navigation.navigate('Login'); // Navigate to LoginPage
    };

    return (
        <View style={styles.container}>
            <View style={styles.slidecontainer}>
                <Swiper 
                    style={styles.wrapper}
                    dotColor={colors.secondory}
                    activeDotColor={colors.primary}
                    paginationStyle={styles.paginationStyle} 
                    height={600} 
                >
                    <View style={styles.slide}>
                        <Image style={styles.image} source={require('../assets/Login/login_1.png')} />
                        <Text style={styles.title}>1000만 야구팬이{'\n'}한 곳에</Text>
                        <Text style={styles.subtitle}>야구를 좋아하는 모두를 위해 함께할게요</Text>
                    </View>
                    <View style={styles.slide}>
                        <Image style={styles.image} source={require('../assets/Login/login_2.png')} />
                        <Text style={styles.title}>마이팀의 모든 것을{'\n'}함께 공유</Text>
                        <Text style={styles.subtitle}>마이팀의 영상, 나만의 MVP부터{'\n'}커뮤니티와 블로그까지 나의 덕질을 기록하고{'\n'}공유해봐요!</Text>
                    </View>
                    <View style={styles.slide}>
                        <Image style={styles.image} source={require('../assets/Login/login_3.png')} />
                        <Text style={styles.title}>나만의 야구 일지와{'\n'}덕질 생활을</Text>
                        <Text style={styles.subtitle}>나만의 야구일지와 페이지 관리로{'\n'}보다 편리하고 행복한 덕질을 만들어가요</Text>
                    </View>
                </Swiper>
            </View>
            <TouchableOpacity style={styles.button} onPress={onPressHandler}>
                <Text style={styles.buttonText}>시작하기</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    slidecontainer: {
        height: 650,
    },
    wrapper: {
        height: 500,
    },
    slide: {
        flex: 1,
        marginTop: 58,
        alignItems: 'center',
    },
    image: {
        width: 366,
        height: 304,
    },
    title: {
        marginTop: 30,
        fontSize: 28,
        fontWeight: '800',
        marginLeft: 29,
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    subtitle: {
        marginTop: 20,
        fontSize: 16,
        color: '#666',
        textAlign: 'left',
        marginLeft: 29,
        alignSelf: 'flex-start',
    },
    button: {
        backgroundColor: colors.primary,
        width: 342,
        height: 55,
        padding: 10,
        borderRadius: 44,
        marginTop: 20,  // Swiper와 버튼 사이의 간격 조정
        alignSelf: 'center',
        justifyContent: 'center',  // 버튼의 내용을 중앙에 배치
        alignItems: 'center',      // 버튼의 내용을 중앙에 배치
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '600',
    },
    paginationStyle: {
        top: 600,  // 점 위치 조정
    },
});

export default StartPage;
