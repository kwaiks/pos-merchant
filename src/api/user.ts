import axios from "../utils/axios";

export const findUserByEmail = async (email: string) => {
    try {
        const { data } = await axios.get(`/user/user-email/${email}`);
        if (data['status'] !== 200){
            throw new Error(data['message']);
        }
        return {
            userFound: true,
            user: data['data']
        }
    } catch (err) {
        return {
            userFound: false,
        }
    }
}

export const getUsers = async () => {
    try {
        const { data } = await axios.get('/user/users');
        if (data['status'] !== 200){
            throw new Error(data['message']);
        }
        return data['data'];
    } catch (err) {
        return err;
    }
}