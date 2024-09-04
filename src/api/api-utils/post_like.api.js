import { api } from './../../Context API/api';

export const post_like_api = {
    post: async (req) =>{
        const result = await api.post("/api-utils/post_like", req);
        return result.data;
    }
}