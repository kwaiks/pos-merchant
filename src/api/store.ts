import axios from "../utils/axios";

export const addStore = async (data: FormData) => {
    try {
        const result = await axios.post("/store/add-store", data);
        if(typeof result === 'undefined'){
            throw new Error("An error occured")
        }
        return;
    } catch (err) {
        throw err;
    }
}

export const editStore = async (data: FormData) => {
    try {
        const result = await axios.post("/store/edit-store", data);
        if(typeof result === 'undefined'){
            throw new Error("An error occured")
        }
        return;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const getStoreById = async (id: string | number) => {
    try {
        const result = await axios.get(`/store/stores/${id}`);
        if(typeof result === 'undefined'){
            throw new Error("An error occured");
        }
        const { data } = result;
        if (data['status'] !== 200){
            throw new Error("Error Occurred")
        }
        delete data['data']['userEmail'];
        return data['data'];
    } catch (err){
        throw err;
    }
}

export const getAllStore = async () => {
    try {
        const result = await axios.get("/store/stores");
        if(typeof result === 'undefined'){
            throw new Error("An error occured");
        }
        const { data } = result;
        if (data['status'] !== 200) throw new Error(data['message']);
        return data['data'];
    } catch (err){
        throw err;
    }
}