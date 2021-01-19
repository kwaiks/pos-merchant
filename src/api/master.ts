import axios from "utils/axios";

export const getFacilities = async () => {
    try {
        const { data } = await axios.get("/master/facility");
        if (data['status'] !== 200) throw new Error(data['message']);
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const getStoreCategory = async () => {
    try {
        const { data } = await axios.get("/master/store-category");
        console.log(data);
        if (data['status'] !== 200) throw new Error(data['message']);
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const getMenuCategory = async () => {
    try {
        const { data } = await axios.get("/master/menu-category");
        if (data['status'] !== 200) throw new Error(data['message']);
        return data['data'];
    } catch (err) {
        throw err;
    }
}