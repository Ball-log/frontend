import React, { useState } from 'react';
import { community_api } from '../api/community/community.api';
import { community_error } from '../api/community/community.error';
import { comment_api } from '../api/api-utils/comment.api';
import { reply_api } from '../api/api-utils/reply.api';

const Context = React.createContext();
const ContextProvider = ({children}) => {
    const [postData, setPostData] = useState({
        "created_at": "2024-08-11T08:30:14.000Z",
        img_urls: []
      })
    const [postList, setPostList] = useState([{data: {}}]);
    
    const community_context = {
        get: async (post_id) => {
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
                await reply_api.patch(req);
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
    return (
        <Context.Provider value={{ community_context, reply_context, comment_context, postData, postList }}>
            {children}
        </Context.Provider>
    );
};
export { Context, ContextProvider };