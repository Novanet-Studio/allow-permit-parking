import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import DashboardLayout from '../components/DashboardLayout';
import useUser from '../hooks/use-user';
import { Card, CardWrapper } from '../components/Card';

import propertyIcon from '../assets/images/app_icon_properties.svg';
import parkingIcon from '../assets/images/app_icon_parking.svg';
import residentIcon from '../assets/images/app_icon_residents.svg';
import userIcon from '../assets/images/app_icon_users.svg';

export default function Home(): JSX.Element {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }
  }, []);

  return (
    <DashboardLayout>
      <CardWrapper>
        <Card
          title="Properties"
          icon={propertyIcon}
          addText="Add a property"
          addLink="/add-property"
          manageText="Manage properties"
          manageLink="/properties"
        />
        <Card
          title="Parking"
          icon={parkingIcon}
          addText="Add parking"
          addLink=""
          manageText="Manage parking"
          manageLink=""
        />
        <Card
          title="Residents"
          icon={residentIcon}
          addText="Add a resident"
          addLink=""
          manageText="Manage residents"
          manageLink=""
        />
        <Card
          title="Users"
          icon={userIcon}
          addText="Add a user"
          addLink=""
          manageText="Manage users"
          manageLink=""
        />
      </CardWrapper>
    </DashboardLayout>
  );
}
