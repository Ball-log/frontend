import React, { useState, useEffect, useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import ComuPostListScreen from './ComuPostListScreen';
import { Context } from '../../context/context';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

export default function CommunityScreen() {
  const { community_context, postData, postList } = useContext(Context);
  const [type, setType] = useState('league');
  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    const render = async () => {
      await community_context.get_list(type);
    }
    render()
  }, [ type ]);

  const handlePressType = async (type) => {
    try {
      setType(type);
      await community_context.get_list(type);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      <HeaderWrapper>
        <CtgyWrapper>
          <CtgyButton 
            onPress={() => handlePressType('league')} 
            isActive={type === 'league'}
          >
            <CtgyText>리그 커뮤니티</CtgyText>
            <TextWrapper1 isActive={type === 'league'} />
          </CtgyButton>
          <CtgyButton 
            onPress={() => handlePressType('team')} 
            isActive={type === 'team'}
          >
            <CtgyText>마이팀 커뮤니티</CtgyText>
            <TextWrapper2 isActive={type === 'team'} />
          </CtgyButton>
        </CtgyWrapper>
        <InputBoxWrapper>
          <SearchButton>
            <Feather name="search" size={20} color="#C51E3A" />
          </SearchButton>
          <InputBox 
            placeholder='글을 입력하여주세요' 
            placeholderTextColor={'#C51E3A'}
            multiline
          />
        </InputBoxWrapper>
      </HeaderWrapper>

        <ComuPostListScreen posts={postList.data} type = {type}/>
      
      <ButtonWrapper>
        <WriteButton onPress={() => navigation.navigate('ComuWriteScreen', { isPatch: false, type: type })}>
          <FontAwesome6 name="pen" size={20} color="#fff" />
          <ButtonText>글 쓰기</ButtonText>
        </WriteButton>
      </ButtonWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex: 1;
  background-color: #fff;
`;

const HeaderWrapper = styled.View`
  margin-right: 13px;
  margin-left: 13px;
  padding-bottom: 5px;
  justify-content: center;
  align-items: center;
`;

const CtgyWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 13px;
`;

const CtgyButton = styled.TouchableOpacity`
  width: 50%;
  height: 42px;
  align-items: center;
  justify-content: center;
`;

const TextWrapper1 = styled.View`
  position: absolute;
  bottom: 5px;
  width: 80px;
  border-bottom-width: ${({ isActive }) => (isActive ? '2px' : '0')};
  border-bottom-color: ${({ isActive }) => (isActive ? '#000000' : 'transparent')};
`;

const TextWrapper2 = styled.View`
  position: absolute;
  bottom: 5px;
  width: 90px;
  border-bottom-width: ${({ isActive }) => (isActive ? '2px' : '0')};
  border-bottom-color: ${({ isActive }) => (isActive ? '#000000' : 'transparent')};
`;

const CtgyText = styled.Text`
  font-size: 17px;
  width: 100%;
  text-align: center;
  font-family: 'Inter-Bold';
`;

const InputBoxWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 20px;
  border-color: #C51E3A;
  border-width: 1px;
  width: 100%;
  height: 34px;
  gap: 5px;
`;

const InputBox = styled.TextInput`
  font-size: 17px;
  font-family: 'Inter-Regular';
  color: #C51E3A;
  width: 90%;
  height: auto;
  align-items: center;
  justify-content: center;
`;

const SearchButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.View`
  flex-direction: row;
  position: absolute;
  bottom: 0px;
  right: 0px;
  background-color: #C51E3A;
  width: 100px;
  height: 35px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  elevation: 2;
  right: 13px;
  bottom: 13px;
`;

const WriteButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-right: 10px;
  padding-left: 10px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-family: 'Inter-Bold';
  font-size: 16px;
  margin-left: 10px;
`;