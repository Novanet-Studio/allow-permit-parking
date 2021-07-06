import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

type CreateBuildingParams = {
  name: string;
};

export interface UseBuildingHook<T> {
  error: Error | null;
  createBuilding(
    residenceId: string,
    params: CreateBuildingParams,
  ): Promise<AxiosResponse<T>>;
  updateBuildings(buildings: T[] | AxiosResponse<T>[]): void;
  response: T | null;
  buildings: T[] | null;
  isLoading: boolean;
}

export default function useBuilding<T>(): UseBuildingHook<T> {
  const [buildings, setBuildings] = useState<T[] | null>(null);
  const [response, setResponse] = useState<T | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getBuildings = async () => {
      setLoading(true);
      try {
        const result = await axios.get('api/v1/building');
        setBuildings(result.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getBuildings();
  }, []);

  const updateBuildings = (buildings: T[]) => setBuildings(buildings);

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
    buildings,
    error,
    response,
    isLoading,
    createBuilding,
    updateBuildings,
  };
}
