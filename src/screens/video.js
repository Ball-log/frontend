import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FlatList, View, StyleSheet, Dimensions, Text, SafeAreaView } from 'react-native';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');
const calculatedHeight = height - 100 - height * 0.1;
const videos = [
  { id: '1', uri: 'https://ballog.s3.ap-northeast-2.amazonaws.com/video/test.mp4' },
  { id: '2', uri: 'https://ballog.s3.ap-northeast-2.amazonaws.com/video/test2.mp4' },
  { id: '3', uri: 'https://ballog.s3.ap-northeast-2.amazonaws.com/video/test3.mp4' },
];

const VideoScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef({});

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;  
      setCurrentIndex(newIndex);

      // 현재 화면에 보이는 동영상만 재생하고, 나머지는 정지합니다.
      Object.keys(videoRefs.current).forEach((key) => {
        const videoRef = videoRefs.current[key];
        if (key === newIndex.toString()) {
          videoRef.playAsync();
        } else {
          videoRef.stopAsync();
        }
      });
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.videoContainer}>
      <Video
        ref={(ref) => {
          if (ref) {
            videoRefs.current[index] = ref;
          }
        }}
        source={{ uri: item.uri }}
        style={styles.video}
        shouldPlay={currentIndex === index}
        resizeMode="contain"
        useNativeControls={false}
        isLooping
      />
      <View style={styles.overlayTextContainer}>
        <Text style={styles.overlayTextUser}>유저네임</Text>
        <Text style={styles.overlayText}>동영상 설명</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false} // 스크롤바 숨기기
        snapToAlignment="center"
        snapToInterval={calculatedHeight+1}
        decelerationRate="0.99" // 빠른 감속 속도
        scrollEventThrottle={16} // 스크롤 이벤트 호출 빈도
        bounces={false} // 반동 효과 비활성화
        contentContainerStyle={styles.contentContainer} // 페이지 사이 빈 화면 제거
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: calculatedHeight,
    flex: 1,
    paddingTop: 0
  },
  videoContainer: {
    width: width,
    height: calculatedHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // 페이지 배경 색상 설정
  },
  video: {
    width: width,
    height: calculatedHeight,
  },
  overlayTextContainer: {
    position: 'absolute',
    bottom: 0, // 하단에 배치
    left: 0, // 왼쪽 끝에 배치
    width: width, // 화면 너비만큼
    padding: 10, // 텍스트 여백
    alignItems: 'flex-start', // 텍스트를 왼쪽에 정렬
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    left: 0, // 왼쪽 끝에 배치
    padding: 10,
    borderRadius: 5,
  },
  overlayTextUser: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    left: 0, // 왼쪽 끝에 배치
    padding: 10,
    paddingBottom: 0,
    borderRadius: 5,
  },
});

export default VideoScreen;