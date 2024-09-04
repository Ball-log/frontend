import axios from "axios"
import { getHeader } from "../../utils/get_header"

export const myPage_api = {
    get: async () => {
        const headers = await getHeader();
        const result = await axios.get("https://api.ballog.store/myPage", {
        headers: headers
    });
        return result.data.result;
    }, 
    get_post: async (date) => {
        const headers = await getHeader();
        const result = await axios.post(`https://api.ballog.store/myPage/post?date=${date}`, {
        headers: headers
        });
        return result.data.result;
    },
    patch_background_img: async (img_url) => {
        const headers = await getHeader()
        const result = await axios.patch("https://api.ballog.store/myPage/setting/backgroundImg", 
            {
                user_background_img: img_url, // 요청 본문에 포함
            },
            { 
                headers: headers
            });
        return result.data.result;
    },
    get_teamSetting: async () => {
        const headers = await getHeader();
        const result = await axios.get("https://api.ballog.store/myPage/setting/teamSetting", {
            headers: headers
        });
        return result.data.result;
    },
    patch_teamSetting: async (team_id) => {
        const headers = await getHeader();
        const result = await axios.patch("https://api.ballog.store/myPage/setting/teamSetting",
            {
                team_id: team_id,
            },
            {
                headers: headers
            });
        return result.data.result;
    }
}