import { api } from './../../Context API/api';

export const reply_api = {
    post: async (req) =>{
        const result = await api.post("/api-utils/reply", req);
        return result.data;
    },
    patch: async (req) =>{
        const result = await api.patch("/api-utils/reply", req);
        return result.data;
    },
    delete: async (req) =>{
        console.log(req)
        const result = await api.delete("/api-utils/reply", { data: req });
        console.log(result.data)
        return result.data;
    }
}