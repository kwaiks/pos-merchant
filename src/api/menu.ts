import axios from "utils/axios";

export const getStoreMenu = async (storeId: number) => {
    try {
        const { data } = await axios.get(`/menu/store/${storeId}`);
        if (data['status'] !== 200) {
            throw new Error(data['message']);
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const getMenuDetail = async (menuId: number) => {
    try {
        const { data } = await axios.get(`/menu/detail/${menuId}`);
        if (data['status'] !== 200) {
            throw new Error(data['message']);
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const addMenu = async (formData: FormData) => {
    try {
        const { data } = await axios.post('/menu/add',formData);
        if (data['status'] !== 200) {
            throw new Error(data['message']);
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const editMenu = async (formData: FormData) => {
    try {
        const { data } = await axios.post('/menu/edit',formData);
        if (data['status'] !== 200) {
            throw new Error(data['message'])
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}