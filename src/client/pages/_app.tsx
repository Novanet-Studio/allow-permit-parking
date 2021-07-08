import axios from 'axios';
import Head from 'next/head';

import UserContext, { UserContextProvider } from '../contexts/user';
import LoginScreen from '../modules/auth/screens/Login';
import Loader from '../components/Loader';

import type { NextComponentType } from 'next';

import '../styles/global.scss';

function App({
  Component,
  pageProps,
}: {
  Component: NextComponentType;
  pageProps: Record<string, unknown>;
}): JSX.Element {
  axios.defaults.baseURL = '/';
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <UserContext.Consumer>
        {({ user, isLoading }) => {

          if (isLoading) {
            return (
              <>
                <Head>
                  <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                  />
                  <title>ESW | Loading...</title>
                </Head>
                <div className="container">
                  <Loader />
                </div>
              </>
            )
          }

          if (user === null) {
            return (
              <>
                <Head>
                  <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                  />
                  <title>ESW | Login</title>
                </Head>
                <div className="container">
                  <LoginScreen />
                </div>
              </>
            );
          }

          return (
            <>
              <Head>
                <meta
                  name="viewport"
                  content="initial-scale=1.0, width=device-width"
                />
              </Head>
              <div className="container">
                <Component {...pageProps} />
              </div>
            </>
          );
        }}
      </UserContext.Consumer>
    </UserContextProvider>
  );
}

export default App;
