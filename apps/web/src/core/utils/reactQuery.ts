import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  QueryFunctionContext,
} from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { api } from "./api";
import { getJwt } from "./helpers";

type QueryKeyT = [string, object | undefined];

type GetInfinitePagesInterface<T> = {
  nextId?: number;
  previousId?: number;
  data: T;
  count: number;
};

export const fetcher = <T>(
  { queryKey, pageParam, meta }: QueryFunctionContext<QueryKeyT>,
  isAuthorized = false
): Promise<T> => {
  const [url, params] = queryKey;
  let headers;

  if (isAuthorized) {
    headers = {
      Authentication: "Bearer " + getJwt(),
    };
  }

  return api
    .get<T>(url, {
      params: { ...params, pageParam, meta },
      headers,
      withCredentials: isAuthorized,
    })
    .then((res) => res.data);
};

export const useLoadMore = <T>(url: string | null, params?: object) => {
  const context = useInfiniteQuery<
    GetInfinitePagesInterface<T>,
    Error,
    GetInfinitePagesInterface<T>,
    QueryKeyT
  >(
    [url!, params],
    ({ queryKey, pageParam = 1, meta }) =>
      fetcher({ queryKey, pageParam, meta }),
    {
      getPreviousPageParam: (firstPage) => firstPage.previousId ?? false,
      getNextPageParam: (lastPage) => {
        return lastPage.nextId ?? false;
      },
    }
  );

  return context;
};

export const usePrefetch = <T>(
  url: string | null,
  params?: AxiosRequestConfig<any>
) => {
  const queryClient = useQueryClient();

  return () => {
    if (!url) {
      return;
    }

    queryClient.prefetchQuery<T, Error, T, QueryKeyT>(
      [url!, params],
      ({ queryKey, meta }) => fetcher({ queryKey, meta })
    );
  };
};

export const useFetch = <T>(
  url: string | null,
  params?: AxiosRequestConfig<any>,
  config?: UseQueryOptions<T, Error, T, QueryKeyT>,
  isAuthorized = false
) => {
  const context = useQuery<T, Error, T, QueryKeyT>(
    [url!, params],
    ({ queryKey, meta }) => fetcher({ queryKey, meta }, isAuthorized),
    {
      enabled: !!url,
      ...config,
    }
  );

  return context;
};

const useGenericMutation = <T, S>(
  func: (data: T | S) => Promise<AxiosResponse<S>>,
  url: string,
  params?: AxiosRequestConfig<any>,
  updater?: ((oldData: T, newData: S) => T) | undefined
) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse, AxiosError, T | S>(func, {
    onMutate: async (data) => {
      await queryClient.cancelQueries([url!, params]);

      const previousData = queryClient.getQueryData([url!, params]);

      queryClient.setQueryData<T>([url!, params], (oldData) => {
        return updater ? updater(oldData!, data as S) : (data as T);
      });

      return previousData;
    },
    onError: (err, _, context) => {
      queryClient.setQueryData([url!, params], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries([url!, params]);
    },
  });
};

export const useDelete = <T>(
  url: string,
  params?: AxiosRequestConfig<any>,
  updater?: (oldData: T, id: string | number) => T
) => {
  return useGenericMutation<T, string | number>(
    (id) => api.delete(`${url}/${id}`),
    url,
    params,
    updater
  );
};

export const usePost = <T, S>(
  url: string,
  params?: AxiosRequestConfig<any>,
  updater?: (oldData: T, newData: S) => T
) => {
  return useGenericMutation<T, S>(
    (data) => api.post<S>(url, data),
    url,
    params,
    updater
  );
};

export const useUpdate = <T, S>(
  url: string,
  params?: AxiosRequestConfig<any>,
  updater?: (oldData: T, newData: S) => T
) => {
  return useGenericMutation<T, S>(
    (data) => api.patch<S>(url, data),
    url,
    params,
    updater
  );
};
