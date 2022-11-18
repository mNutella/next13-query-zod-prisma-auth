import axios, { AxiosRequestConfig } from 'axios';

import { getJwt, pathToApiUrl, setSessionStorageItem } from './helpers';
import { API_ROUTES } from '../config/constants';

const axiosClient = axios.create();

export const refreshAccessToken = async () => {
  const response = await axiosClient.get<{ token: string }>(
    pathToApiUrl(API_ROUTES.refresh),
  );

  return response.data;
};

// TODO: rethink this logic, it works only for first refresh
// There is a problem with the originalRequest: _retry is always undefined in if
let retryRequest = false;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errStatus = error.response.status;

    if (errStatus === 403 && !retryRequest) {
      retryRequest = true;

      const { token } = await refreshAccessToken();
      setSessionStorageItem('accessToken', token);
      originalRequest.headers['Authentication'] = token;

      return axiosClient(originalRequest);
    }

    return Promise.reject(error);
  },
);

export const api = {
  get: <T>(url: string, params?: AxiosRequestConfig<any>) =>
    axiosClient.get<T>(url, {
      ...params,
    }),
  post: <T>(url: string, data: any, params?: AxiosRequestConfig<any>) =>
    axiosClient.post<T>(url, data, {
      ...params,
    }),
  patch: <T>(url: string, data: any, params?: AxiosRequestConfig<any>) =>
    axiosClient.patch<T>(url, data, {
      ...params,
    }),
  delete: <T>(url: string, params?: AxiosRequestConfig<any>) =>
    axiosClient.delete<T>(url, {
      ...params,
    }),
};

export const fetcher = <T>(url: string, isAuthorized = false): Promise<T> => {
  let headers;

  if (isAuthorized) {
    headers = {
      Authentication: 'Bearer ' + getJwt(),
    };
  }

  return api
    .get<T>(url, {
      headers,
      withCredentials: isAuthorized,
    })
    .then((res) => res.data);
};
