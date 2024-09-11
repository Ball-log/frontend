import { api } from '../api';

export const board_api = {
  get: async (post_id) => {
    const result = await api.get(`/board/post/${post_id}`);
    return result.data.result
  },
  post: async (req) => {
    const result = await api.post("/board/post", req);
    return result.data;
  },
  patch: async (post_id, req) => {
    const result = await api.patch(`/board/post/${post_id}`, req);
    return result.data;
  },
  delete: async (post_id) => {
    const result = await api.delete(`/board/post/${post_id}`);
    return result.data;
  }
};