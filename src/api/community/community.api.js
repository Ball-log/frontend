import { api } from './../../Context API/api';

export const community_api = {
  get: async (post_id) => {
    const result = await api.get(`/community/post/${post_id}`);
    return result.data;
  },
  post: async (req) => {
    const result = await api.post("/community/post", req);
    return result.data;
  },
  patch: async (post_id, req) => {
    const result = await api.patch(`/community/post/${post_id}`, req);
    console.log(result.data)
    return result.data;
  },
  delete: async (post_id) => {
    const result = await api.delete(`/community/post/${post_id}`);
    return result.data;
  },
  get_list: async (type, cursor=null, page=null) => {
    const result = await api.get(`/community/posts`, {
        params: { type, cursor, page }
    });
    return result.data;
  }
};