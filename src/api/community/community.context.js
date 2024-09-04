// CommunityProvider.js
import React, { useState } from 'react';
import { community_api } from './community.api';
import { community_error } from './community.error';

const communityContext = React.createContext();

const CommunityProvider = ({ children }) => {
    const [postData, setPostData] = useState({
        "created_at": "2024-08-11T08:30:14.000Z",
        img_urls: []
      })
    const [postList, setPostList] = useState([{data: []}]);

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

    return (
        <communityContext.Provider value={{ community_context, postData, postList }}>
            {children}
        </communityContext.Provider>
    );
};

export { communityContext, CommunityProvider };