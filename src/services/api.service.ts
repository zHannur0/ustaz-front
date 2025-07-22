import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3 }); // Конфигурируем axios-retry

const Api = axios.create({
    baseURL: `http://127.0.0.1:8000/`,
});

export default Api;