// HomeScreen.js
import React, {useState, useMemo} from 'react';
import styled from 'styled-components/native';
import { playersData } from '../data/playersdata';
import { blogData } from '../data/blogdata';
import { getRandomPastelColor } from '../utils/colors';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import TeamLogoImg from '../assets/imgs/teamlogo.png';

export default function HomeScreen() {
  const [playerLikes, setPlayerLikes] = useState(playersData.map(player => player.likes));
  const [blogLikes, setBlogLikes] = useState(blogData.map(blog => blog.likes));

  const handlePlayerLike = (index) => {
    const newLikes = [...playerLikes];
    newLikes[index] += 1;
    setPlayerLikes(newLikes);
  };

  const handleBlogLike = (index) => {
    const newLikes = [...blogLikes];
    newLikes[index] += 1;
    setBlogLikes(newLikes);
  };

  const userCircleColors = useMemo(() => {
    const colors = {};
    blogData.forEach(blog => {
      colors[blog.id] = getRandomPastelColor();
    });
    return colors;
  }, []);

  return (
    <Wrapper showsVerticalScrollIndicator={false}>
      <MvpContainer>
        <CtgyWrapper>
          <Ctgy>최신 MVP</Ctgy>
        </CtgyWrapper> 
        <ScrollContainer horizontal showsHorizontalScrollIndicator={false}>
          <PlayerBox>
            {playersData.map((player, index) => (
              <PlayerContainer
               key={player.id} 
               isLast={index === playersData.length - 1}
               >
                <PlayerImgWrapper>
                  <PlayerImg source={player.image} />
                  <NameBadge>
                    <BadgeText>{player.name}</BadgeText>
                  </NameBadge>
                  <LogoBadgeWrapper>
                    <LogoBadge>
                      <Square />
                      <Triangle />
                    </LogoBadge>
                    <TeamLogo source={TeamLogoImg} />
                  </LogoBadgeWrapper>
                </PlayerImgWrapper>
                <PlayerInfoWrapper>
                  <PlayerNameWrapper>
                    <PlayerCircle>
                      <FirstName>{player.name.slice(1)}</FirstName>
                    </PlayerCircle>
                    <PlayerName>{player.name}</PlayerName>
                  </PlayerNameWrapper>
                  <IconWrapper>
                    <LikeIcon onPress={()=>handlePlayerLike(index)}><AntDesign name="hearto" size={10} color="#E05936" /></LikeIcon>
                    <LikeCount>{playerLikes[index]}</LikeCount>
                    <ChatIcon><MaterialCommunityIcons name="message-reply-outline" size={10} color="#8892F7" /></ChatIcon>
                    <ChatCount>{player.comments}</ChatCount>
                  </IconWrapper>
                </PlayerInfoWrapper>
              </PlayerContainer>
            ))}
          </PlayerBox>
        </ScrollContainer>
      </MvpContainer>
      <BlogContainer>
        <CtgyWrapper>
          <Ctgy>인기 BLOG</Ctgy>
        </CtgyWrapper>
        {blogData.map((blog, index) => (
        <BlogBox
         key={blog.id} 
         isFirst={index === 0} 
         isLast={index === blog.length - 1}
        >
          <DetailBox>
            <UserWrapper>
              <UserCircle color={userCircleColors[blog.id]}>
                <FirstName>{blog.username.slice(1)}</FirstName>
              </UserCircle>
              <UserName>{blog.username}</UserName>
            </UserWrapper>
            <DetailWrapper>
              <BlogTitle numberOfLines={1}>{blog.title}</BlogTitle>
              <BlogDetail numberOfLines={2}>{blog.detail}</BlogDetail>
            </DetailWrapper>
            <BlogFooter>
              <IconWrapper>
                <LikeIcon onPress={() => handleBlogLike(index)}>
                  <AntDesign name="hearto" size={10} color="#E05936" />
                </LikeIcon>
                <LikeCount>{blogLikes[index]}</LikeCount>
                <ChatIcon>
                  <MaterialCommunityIcons name="message-reply-outline" size={10} color="#8892F7" />
                </ChatIcon>
                <ChatCount>{blog.comments}</ChatCount>
              </IconWrapper>
              <DateTime>{`${blog.date} | ${blog.time}`}</DateTime>
            </BlogFooter>
          </DetailBox>
          <ImgBox>
            <BlogImg source={blog.image} />
          </ImgBox>
        </BlogBox>
        ))}
      </BlogContainer>
    </Wrapper>
  );
}

const Wrapper = styled.ScrollView`
  flex: 1;
  padding-right: 13px;
  padding-left: 13px;
  background-color: #fff;
`;

const MvpContainer = styled.View`
  margin-top: 20px;
  width: 100%;
  height: auto;
`;

const CtgyWrapper = styled.View`
  background-color: #C51E3A;
  justify-content: center;
  align-items: center;
  width: 91px;
  height: 30px;
  border-radius: 39px;
  margin-bottom: 8px;
`;

const Ctgy = styled.Text`
  font-size: 19px;
  font-family: 'Inter-Bold';
  color: #fff;
`;

const ScrollContainer = styled.ScrollView``;

const PlayerBox = styled.View`
  flex-direction: row;
  height: 167.35px;
  width: auto;
`;

const PlayerContainer = styled.TouchableOpacity`
  margin-right: ${props => props.isLast ? '0' : '13px'};
  align-items: center;
`;

const PlayerImgWrapper = styled.View`
`;

const PlayerImg = styled.Image`
  width: 113.67px;
  height: 142.93px;
  resize-mode: contain;
  border-color: #1D467D;
  border-width: 1px;
  border-radius: 2px;
`;

const NameBadge = styled.View`
  position: absolute;
  bottom: 1px;
  left: 0px;
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-left-width: 0px;
  border-right-width: 113px;
  border-bottom-width: 42px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: #1D467D;
`;

const BadgeText = styled.Text`
  position: absolute;
  color: #FFFFFF;
  font-family: Inter-Bold;
  font-size: 18px;
  margin-top: 20px;
  margin-left: 5px;
`;

const LogoBadgeWrapper = styled.View`
  position: absolute;
  width: 22.52px;
  height: 37.09px;
  right: 0px;
  align-items: center;
`;

const LogoBadge = styled.View`
`;

const Square = styled.View`
  background-color: #1D467D;
  width: 22.52px;
  height: 28px;
`;

const Triangle = styled.View`
  width: 0px;
  height: 0px;
  border-left-width: 11.26px;
  border-left-color: transparent;
  border-right-width: 11.26px;
  border-right-color: transparent;
  border-top-width: 9.09px;
  border-top-color: #1D467D;
`;

const TeamLogo = styled.Image`
  position: absolute;
  top: 8px;
  width: 20.08px;
  height: 17.21px;
`;

const PlayerInfoWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 113.67px;
  height: 20px;;
  margin-top: 5px;
`;

const PlayerNameWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PlayerCircle = styled.View`
  width: 19px;
  height: 19px;
  border-radius: 15px;
  background-color: #E2B066;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

const FirstName = styled.Text`
  font-family: 'Inter-Bold';
  font-size: 8px;
  color: #fff;
`;

const PlayerName = styled.Text`
  font-family: 'Inter-Bold';
  font-size: 11px;
`;

const IconWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LikeIcon = styled.TouchableOpacity``;

const ChatIcon = styled.View``;

const LikeCount = styled.Text`
  color: #E05936;
  margin-right: 5px;
  margin-left: 2px;
  font-size: 11px;
`;

const ChatCount = styled.Text`
  color: #8892F7;
  font-size: 11px;
  padding-right: 1px;
  margin-left: 2px;
`;

const BlogContainer = styled.View`
  margin-top: 30px;
  margin-bottom: 10px;
`;

const BlogBox = styled.TouchableOpacity`
  border-top-width: ${props => (props.isFirst ? '0.5px' : '0')};
  border-top-color: #CCCCCC;
  border-bottom-width: ${props => (props.isLast ? '0' : '0.5px')};
  border-bottom-color: #CCCCCC;
  width: 100%;
  height: 120px;
  padding: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DetailBox = styled.View`
  justify-content: center;
  width: 200px;
  padding-right: 10px;
`;

const ImgBox = styled.View`
  justify-content: center;
`;

const BlogImg = styled.Image`
  width: 130px;
  height: 90px;
  resize-mode: cover;
`;

const UserWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserCircle = styled.View`
  width: 19px;
  height: 19px;
  border-radius: 15px;
  background-color: ${(props) => props.color};
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

const UserName = styled.Text`
  font-family: 'Inter-Bold';
  font-size: 11px;
`;

const DetailWrapper = styled.View`
  margin-top: 5px;
  margin-bottom: 5px;
`;

const BlogTitle = styled.Text`
  font-family: 'Inter-Bold';
  font-size: 16px;
  margin-bottom: 2px;
`;

const BlogDetail = styled.Text`
  font-family: 'Inter-Regular';
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BlogFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DateTime = styled.Text`
  color: #AAAAAA;
  font-size: 11px;
`;