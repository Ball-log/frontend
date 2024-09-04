import { api } from './../../Context API/api';

export const comment_api = {
    post: async (req) =>{
        const result = await api.post("/api-utils/comment", req);
        return result.data;
    },
    patch: async (req) =>{
        const result = await api.patch("/api-utils/comment", req);
        return result.data;
    },
    delete: async (req) =>{
        const result = await api.delete("/api-utils/comment", { data: req });
        return result.data;
    }
}