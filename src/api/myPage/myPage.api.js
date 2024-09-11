import { api } from '../api';

export const myPage_api = {
    get: async () => {
        const result = await api.get("https://api.ballog.store/myPage");
        return result.data.result;
    }, 
    get_post: async (date) => {
        const result = await api.get(`https://api.ballog.store/myPage/post?date=${date}`);
        return result.data.result;
    },
    patch_background_img: async (req) => {
        const result = await api.patch("https://api.ballog.store/myPage/setting/backgroundImg", req);
        return result.data.result;
    },
    get_teamSetting: async () => {
        const result = await api.get("https://api.ballog.store/myPage/setting/teamSetting");
        return result.data.result;
    },
    patch_teamSetting: async (req) => {
        const result = await api.patch("https://api.ballog.store/myPage/setting/teamSetting", req);
        return result.data.result;
    }
}