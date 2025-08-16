import axios from "axios";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  httpsAgent: agent,
});

service.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    console.log("🚀 ~ error:", error)
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default service;