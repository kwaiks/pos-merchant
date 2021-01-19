import axios from "utils/axios";

export const getCategories = async (storeId: number) => {
    try {
        const { data } = await axios.get(`/menu/menu-category/${storeId}`);
        if (data['status'] !== 200) throw new Error(data['message']);
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const addCategory = async (reqData: any) => {
    try {
        const { data } = await axios.post("/menu/menu-category", reqData);
        if (data['status'] !== 200) {
            throw new Error("An error Occurred");
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const removeCategory = async (id: number) => {
    try {
        const { data } = await axios.delete(`/menu/menu-category/${id}`);
        if (data['status'] !== 200) {
            throw new Error("An error Occurred");
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}