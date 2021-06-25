import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';

type CreateBuildingParams = {
  name: string;
};

export interface UseBuildingHook<T> {
  error: Error | null;
  createBuilding(
    residenceId: string,
    params: CreateBuildingParams,
  ): Promise<AxiosResponse<T>>;
  response: T | null;
  isLoading: boolean;
}

export default function useBuilding<T>(): UseBuildingHook<T> {
  const [response, setResponse] = useState<T | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createBuilding = async (
    residenceId: string,
    params: CreateBuildingParams,
  ): Promise<AxiosResponse<T>> => {
    setLoading(true);

    try {
      const result = await axios.post(`api/v1/building/${residenceId}`, {
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
    createBuilding,
  };
}
