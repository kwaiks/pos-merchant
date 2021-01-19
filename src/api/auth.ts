import axios from "utils/axios";

export const login = async (email: string, password: string) => {
    try {
        const { data } = await axios.post('/auth/user/login',{
            email,
            password
        });
        if (data['status'] !== 200){
            throw new Error(data['message']);
        }
        return data['data'];
    } catch (err) {
        throw err;
    }
}

export const logout = async () => {
    try {
        const { data } = await axios.get("/auth/logout");
        if (data['status'] !== 200){
            throw new Error(data['message']);
        }
        return;
    } catch (err) {
        throw err;
    }
}