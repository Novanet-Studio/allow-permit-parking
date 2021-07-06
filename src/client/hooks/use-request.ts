import { useCallback, useState } from 'react';
import axios from 'axios';

import type { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface UseRequestHook<T> {
  error: Error | null;
  execute(
    uri: string,
    data?: unknown,
    axiosParams?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  response: T | null;
  isLoading: boolean;
}

export default function useRequest<T>(
  params: AxiosRequestConfig,
): UseRequestHook<T> {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (uri: string, data?: unknown, axiosParams?: AxiosRequestConfig) => {
      setLoading(true);

      try {
        const result = await axios.request({
          ...params,
          ...(axiosParams ?? null),
          url: uri,
          data: data ?? null,
        });

        setResponse(result.data);

        return result;
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    error,
    execute,
    response,
    isLoading,
  };
}
