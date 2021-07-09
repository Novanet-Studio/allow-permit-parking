import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import Loader from '../components/Loader';
import Dashboard from '../components/DashboardLayout';
import Breadcrumb from '../components/Breadcrumb';
import Subheader from '../components/Subheader';
import { Table } from '../components/Table';

import useRequest from '../hooks/use-request';

import propertiesIcon from '../assets/images/app_icon_properties.svg';

import type { AxiosRequestConfig } from 'axios';
import type { ESW } from '../../@types/esw';

const Request: AxiosRequestConfig = {
  method: 'GET',
};

type RequestType =
  | ESW.Residence[]
  | ESW.Building[]
  | ESW.ParkingLot[]
  | ESW.ParkingSlot[];

export default function Properties(): JSX.Element {
  const [tableData, setTableData] = useState(null);
  const { execute, isLoading } = useRequest<RequestType>(Request);

  useEffect(() => {
    const getProperties = async () => {
      const apiResponse = await Promise.all([
        execute('api/v1/residence'),
        execute('api/v1/building'),
        execute('api/v1/parking/lots'),
        execute('api/v1/parking/slots'),
      ]);

      const response = apiResponse.map((item) => item?.data);

      const residences = response[0];

      // remove residences;
      response.shift();

      const result = residences.map((residence) => {
        const residenceId = residence.id;
        const building = response[0] as ESW.Building[];
        const apartments = response[1] as ESW.ParkingLot[];
        const parkingSlots = response[2] as ESW.ParkingSlot[];

        const buildingId = building
          .filter((build) => build.residenceId === residenceId)
          .map((item) => item.id);

        const totalApartments = apartments.filter((apartment) =>
          buildingId.includes(apartment.buildingId),
        ).length;

        const totalParkingSpaces = parkingSlots.filter(
          (slot) => slot.residenceId === residenceId,
        ).length;

        return {
          id: residence.id,
          propertyName: residence.name,
          systemType: 'permit',
          apartments: totalApartments,
          parkingSpaces: totalParkingSpaces,
          visitorSpaces: 0,
        };
      });

      setTableData(result);
    };

    getProperties();
  }, [execute]);

  const tableHeadings = [
    'Property name',
    'System type',
    'Total apartments',
    'Parking spaces',
    'Visitor spaces',
    'Actions',
  ];

  return (
    <Dashboard showMsg={false}>
      <Breadcrumb />
      <Subheader
        title="Properties"
        icon={propertiesIcon}
        iconAlt="properties icon"
      >
        <button className="button button--gray">
          <Link href="/add-property">
            <a className="button--gray__link">Add a property</a>
          </Link>
        </button>
      </Subheader>
      {isLoading ? (
        <Loader />
      ) : (
        <Table headings={tableHeadings} data={tableData} mode="action" />
      )}
    </Dashboard>
  );
}
