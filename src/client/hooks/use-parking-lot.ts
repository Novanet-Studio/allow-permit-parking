import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';

type CreateParkingLotParams = {
  name: string;
};

export interface UseParkingLotHook<T> {
  error: Error | null;
  createParkingLot(
    residenceId: string,
    params: CreateParkingLotParams,
  ): Promise<AxiosResponse<T>>;
  response: T | null;
  isLoading: boolean;
}

export default function useParkingLot<T>(): UseParkingLotHook<T> {
  const [response, setResponse] = useState<T | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createParkingLot = async (
    parkingLotId: string,
    params: CreateParkingLotParams,
  ): Promise<AxiosResponse<T>> => {
    setLoading(true);

    try {
      const result = await axios.post(`api/v1/parking/lots/${parkingLotId}`, {
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
    createParkingLot,
  };
}
