import React, { createContext, useState } from 'react';
import axios from 'axios';

import {
  getLocalStorageValue,
  Key,
  setLocalStorageValue,
} from '../utils/local-storage';

import type { ESW } from '../../@types/esw';

export type Props = {
  children: JSX.Element;
};

export interface UserContext {
  user: ESW.User | null;
  isLoading: boolean;
  login(email: string, password: string): Promise<void>;
  resumeSession(): Promise<void>;
}

const UserContext = createContext<UserContext>(null);

UserContext.displayName = 'UserContext';

export function UserContextProvider({ children }: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<ESW.User | null>(null);

  const openSession = (user: ESW.User) => {
    setUser(user);
    setLocalStorageValue(Key.User, user);
  };

  const closeSession = () => {
    setUser(null);
    setLocalStorageValue(Key.User, null);
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const loginResponse = await axios.post(
        'api/auth/login',
        {},
        {
          auth: {
            username: email,
            password,
          },
        },
      );
  
      if (loginResponse.status === 200) {
        const meResponse = await axios.get('api/v1/me');
  
        if (meResponse.status === 200) {
          const user = meResponse.data;
  
          openSession(user);
          setIsLoading(false);
  
          return;
        }
  
        setIsLoading(false);
        // TODO: Implement a dedicated error
        throw new Error('Failed to fetch user data');
      }
  
      setIsLoading(false);
      // TODO: Implement a dedicated error
      throw new Error('Failed to authenticate');
    } catch (error) {
      // setIsLoading(false);
    }
  };

  const resumeSession = async (): Promise<void> => {
    const localUser = getLocalStorageValue(Key.User);

    if (localUser === null) {
      return;
    }

    setIsLoading(true);

    try {
      const refreshTokenResponse = await axios.post('api/auth/refresh');

      if (refreshTokenResponse.status === 200) {
        const meResponse = await axios.get('api/v1/me');

        if (meResponse.status === 200) {
          const user = meResponse.data;

          openSession(user);
          setIsLoading(false);

          return;
        }

        closeSession();
        setIsLoading(false);

        return;
      }

      closeSession();
      setIsLoading(false);
    } catch (error) {
      if (error.response.status === 500 ) {
        closeSession();
        setIsLoading(false);
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        resumeSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
