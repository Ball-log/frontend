import React, { useState } from 'react';
import { community_api } from '../api/community/community.api';
import { community_error } from '../api/community/community.error';
import { comment_api } from '../api/api-utils/comment.api';
import { reply_api } from '../api/api-utils/reply.api';
import { post_like_api } from '../api/api-utils/post_like.api';
import { myPage_api } from '../api/myPage/myPage.api';
import { board_api } from '../api/board/board.api';
import { info_api } from '../api/api-utils/info.api';

const Context = React.createContext();
const ContextProvider = ({children}) => {
    const [postData, setPostData] = useState({
        "created_at": "2024-08-11 08:30", img_urls: ["temp"], user_icon_url: ["temp"]})
    const [postList, setPostList] = useState([{data: {}}]);
    const [myPage, setMyPage] = useState({user_background_img: null})
    const [postByDate, setPostByDate] = useState()
    const [matchInfo, setMatchInfo] = useState(null)
    const [playerInfo, setPlayerInfo] = useState(null)
    const [selectedMatch, setSelectedMatch] = useState(null)
    
    const community_context = {
        get: async (post_id) => {
            console.log("in community context, post_id", post_id)
            try {
                const response = await community_api.get(post_id);
                setPostData(response.result);
            } catch (error) {
                community_error.get(error);
            }
        },
        post: async (req) => {
            try {
                await community_api.post(req);
            } catch (error) {
                community_error.post(error);
            }
        },
        patch: async (post_id, req) => {
            try {
                await community_api.patch(post_id, req);
            } catch (error) {
                community_error.patch(error);
            }
        },
        delete: async (post_id) => {
            try {
                await community_api.delete(post_id);
            } catch (error) {
                community_error.delete(error);
            }
        },
        get_list: async (type, cursor = null, page = null) => {
            try {
                const response = await community_api.get_list(type, cursor, page);

                if (response.result.totalCount  === 0) {
                    setPostList([{data: []}])
                } else {
                    setPostList(response.result);
                }
            } catch (error) {
                community_error.get_list(error);
            }
        }
    }
    const board_context = {
        get: async (post_id) => {
            console.log("in board context, post_id", post_id)
            try {
                const response = await board_api.get(post_id);
                setPostData(response);
            } catch (error) {
                //community_error.get(error);
            }
        },
        post: async (req) => {
            
            try {
                await board_api.post(req);
            } catch (error) {
                //community_error.post(error);
            }
        },
        patch: async (post_id, req) => {
            try {
                await board_api.patch(post_id, req);
            } catch (error) {
                //community_error.patch(error);
            }
        },
        delete: async (post_id) => {
            try {
                await board_api.delete(post_id);
            } catch (error) {
                //community_error.delete(error);
            }
        }
    };
    const comment_context = {
        post: async (req) => {
            try {
                await comment_api.post(req);
            } catch (error) {
                //comment_error.post(error);
            }
        },
        patch: async (req) => {
            try {
                await comment_api.patch(req);
            } catch (error) {
                //comment_error.patch(error);
            }
        },
        delete: async (req) => {
            try {
                await comment_api.delete(req);
            } catch (error) {
                //comment_error.delete(error);
            }
        }
    }
    const reply_context = {
        post: async (req) => {
            try {
                await reply_api.post(req);
            } catch (error) {
                //reply_error.post(error);
            }
        },
        patch: async (req) => {
            try {
                await reply_api.patch(req);
            } catch (error) {
                //reply_error.patch(error);
            }
        },
        delete: async (req) => {
            try {
                await reply_api.delete(req);
            } catch (error) {
                //reply_error.delete(error);
            }
        }
    }
    const post_like_context = {
        post: async (req) => {
            try {
                await post_like_api.post(req);
            } catch (error) {
                //post_like_error.post(error);
            }
        }
    }
    const myPage_context = {
        get: async () => {
            try {
                const result = await myPage_api.get();
                setMyPage(result)
            } catch (error) {
                //reply_error.post(error);
            }
        },
        get_post: async (date) => {
            try {
                const result = await myPage_api.get_post(date);
                setPostByDate(result)
            } catch (error) {
                //reply_error.post(error);
            }
        },
        patch_background_img: async (req) => {
            try {
                await myPage_api.patch_background_img(req);
            } catch (error) {
                //reply_error.patch(error);
            }
        },
        get_teamSetting: async () => {
            try {
                const result = await myPage_api.get_teamSetting();
            } catch (error) {
                //reply_error.delete(error);
            }
        },
        patch_teamSetting: async (req) => {
            try {
                await myPage_api.patch_teamSetting(req);
            } catch (error) {
                //reply_error.delete(error);
            }
        },
        
    }
    const info_context = {
        post_s3: async (req) =>{
            try {
                const result = await info_api.post_s3(req);
                return result
            } catch (error) {

            }
        },
        get_match_info: async (date) =>{
            console.log("in info_context.get_match_info", date);
            try {
                const result = await info_api.get_matchInfo(date);
                console.log("in info_context.get_match_info", result);
                setMatchInfo(result);
            } catch(error) {

            }
        },
        get_player_info: async (match_id) =>{
            try {
                const result = await info_api.get_player_info(match_id);
                setPlayerInfo(result)
            } catch(error) {

            }
        }
    }
    return (
        <Context.Provider value={{ 
            post_like_context, 
            community_context,
            board_context, 
            reply_context, 
            comment_context,
            myPage_context,
            info_context, 
            postData, 
            postList,
            myPage,
            postByDate,
            matchInfo,
            playerInfo,
            selectedMatch, 
            setSelectedMatch
            }}>
            {children}
        </Context.Provider>
    );
};
export { Context, ContextProvider };