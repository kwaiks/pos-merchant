import axios from "utils/axios";

export const getInventories = async (storeId: number) => {
    try {
        const { data } = await axios.get(`/inventory/store/${storeId}`);
        if (data['status'] !== 200) {
            throw new Error(data['message']);
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const getInventoryDetail = async (inventoryId: number) => {
    try {
        const { data } = await axios.get(`/inventory/detail/${inventoryId}`);
        if (data['status'] !== 200) {
            throw new Error(data['message']);
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const addInventory = async (formData: FormData) => {
    try {
        const { data } = await axios.post('/inventory/add',formData);
        if (data['status'] !== 200) {
            throw new Error(data['message']);
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const editInventory = async (formData: FormData) => {
    try {
        const { data } = await axios.post('/inventory/edit',formData);
        if (data['status'] !== 200) {
            throw new Error(data['message'])
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}