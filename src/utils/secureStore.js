import * as SecureStore from 'expo-secure-store';

export const store = {
    save: async (key, value) => {
        await SecureStore.setItemAsync(key, value);
    },
    get: async (key) => {
        const data = await SecureStore.getItemAsync(key);
        return data;
    },
    delete: async (key) => {
        await SecureStore.deleteItemAsync(key);
    }
}