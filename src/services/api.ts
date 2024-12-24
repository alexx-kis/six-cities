import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BACKEND_URL, REQUEST_TIMEOUT, StatusCodeMapping } from '../const';
import { getToken } from './token';
import { DetailMessageType } from '../types';
import { toast } from 'react-toastify';

// %======================== api ========================% //
const shouldDisplayError = (response: AxiosResponse) => Boolean(StatusCodeMapping[response.status]);

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT
  });

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers['x-token'] = token;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageType>) => {
      if (error.response && shouldDisplayError(error.response)) {
        const detailMessage = error.response.data;
        toast.warn(detailMessage.message);
      }
      throw error;
    }
  );

  return api;
};

