import { store } from "./secureStore";

export const getHeader = async () => {
    return {
        Authorization: await store.get('Authorization'),
        'Content-Type': 'application/json',
    };
};