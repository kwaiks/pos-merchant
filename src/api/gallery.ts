import axios from "utils/axios";

export const getAllMedia = async (storeId: number) => {
    try {
        const { data } = await axios.get(`/store/gallery/${storeId}`);
        if (data['status'] !== 200) throw new Error(data['message']);
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const addMedia = async (reqData: any, image: File) => {
    try {
        const formData = new FormData();
        const request = JSON.stringify(reqData);
        formData.append("data", request);
        formData.append("image", image);
        console.log(image)
        const { data } = await axios.post("/store/gallery", formData, {
            headers: {'Content-Type': 'multipart/form-data' }
        });
        if (data['status'] !== 200) {
            throw new Error("An error Occurred");
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const removeMedia = async (id: number) => {
    try {
        const { data } = await axios.delete(`/store/gallery/${id}`);
        if (data['status'] !== 200) {
            throw new Error("An error Occurred");
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}