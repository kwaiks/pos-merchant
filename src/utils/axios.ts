import axios from 'axios';
import Cookies from 'universal-cookie';
import { BASE_API_URL } from "../config/appConfig";

const axiosApiInstance = axios.create(
    {
        baseURL: BASE_API_URL,
    }
);

axiosApiInstance.interceptors.request.use(
    (config) => {
        const cookies = new Cookies();
        config.headers["Authorization"] = `Bearer ${cookies.get('ATKN')}`;
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

axiosApiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const origin = error.config;
        if (error.response.status === 401 && !origin._retry){
            try {
                const cookies = new Cookies();
                const { data } = await axiosApiInstance.get(`/auth/refresh`);
                cookies.set("ATKN", data['newToken'], {
                    path: "/"
                });
                return axiosApiInstance(origin);
            } catch (err) {
                return Promise.reject(error);
            }
        }
    }
);

export default axiosApiInstance;