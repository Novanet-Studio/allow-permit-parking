import React from 'react';
import Head from 'next/head';

import Header from './Header';
import Subheader from '../Subheader';

import dashboardIcon from '../../assets/images/app_icon_dashboard.svg';

type Props = {
  children: JSX.Element | JSX.Element[];
  title?: string;
  showMsg?: boolean;
};

const subheaderTitle =
  'Welcome to your new Admin console homepage! You’ll find easier navigation and quick access to common property, parking, residents and user tasks.';

export default function Layout({
  children,
  title,
  showMsg = true,
}: Props): JSX.Element {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>ESW{title ? ' | ' + title : ''}</title>
      </Head>
      <div className="dashboard">
        <Header />
        <main className="main">
          {showMsg && (
            <Subheader
              title={subheaderTitle}
              icon={dashboardIcon}
              iconAlt="dashboard icon"
            />
          )}
          {children}
        </main>
      </div>
    </>
  );
}
