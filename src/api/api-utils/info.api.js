import { api } from '../api';

export const info_api = {
    post_s3: async (req) =>{
        const result = await api.post("/api-utils/s3", req);
        return result.data.result;
    },
    get_matchInfo: async (date) =>{
        console.log("in info_api.get_match_info", date);
        const result = await api.get(`/api-utils/matchInfo?date=${date}`);
        return result.data.result;
    },
    get_player_info: async (match_id) =>{
        const result = await api.get(`/api-utils//api-utils/player_info/${match_id}`, { data: req });
        return result.data.result;
    }
}