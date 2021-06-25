import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';

type CreatePropertyParams = {
  name: string;
  systemType?: 'permit' | 'sticker';
};

export interface UsePropertyHook<T> {
  error: Error | null;
  createProperty(params: CreatePropertyParams): Promise<AxiosResponse<T>>;
  response: T | null;
  isLoading: boolean;
}

export default function useProperty<T>(): UsePropertyHook<T> {
  const [response, setResponse] = useState<T | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createProperty = async (
    params: CreatePropertyParams,
  ): Promise<AxiosResponse<T>> => {
    setLoading(true);

    try {
      const result = await axios.post('api/v1/residence', {
        ...params,
      });

      setResponse(result.data);

      return result;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    response,
    isLoading,
    createProperty,
  };
}
