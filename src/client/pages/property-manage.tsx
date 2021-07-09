import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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

export default function PropertyManage(): JSX.Element {
  const router = useRouter();
  const [residence, setResidence] = useState(null);
  const [tableData, setTableData] = useState(null);
  const { execute, isLoading } = useRequest<RequestType>(Request);

  useEffect(() => {
    const getProperties = async () => {
      const apiResponse = await Promise.all([
        execute(`api/v1/residence/${router.query.residenceId}`),
        execute('api/v1/building'),
        execute('api/v1/parking/lots'),
        execute('api/v1/parking/slots'),
      ]);

      const response = apiResponse.map((item) => item.data);
      const residence = (response[0] as unknown) as ESW.Residence;

      setResidence(residence);

      // remove residences;
      response.shift();

      const buildings = response[0] as ESW.Building[];
      const apartments = response[1] as ESW.ParkingLot[];
      const parkingSlots = response[2] as ESW.ParkingSlot[];

      const buildingId = buildings
        .filter((building) => building.residenceId === residence.id)
        .map((building) => building.id);

      const totalApartments = apartments.filter((apartment) =>
        buildingId.includes(apartment.buildingId),
      ).length;

      const totalParkingSpaces = parkingSlots.filter(
        (slot) => slot.residenceId === residence.id,
      ).length;

      setTableData([
        {
          apartments: totalApartments,
          parkingSpaces: totalParkingSpaces,
          permitSpaces: 0,
          reservedSpaces: 0,
          visitorSpaces: 0,
        },
      ]);
    };

    getProperties();
  }, []);

  const tableHeadings = [
    'Apartments',
    'Parking spaces',
    'Permit active',
    'Reserved active',
    'Visitor Active',
  ];

  return (
    <Dashboard showMsg={false}>
      <Breadcrumb />
      <Subheader
        title="Properties"
        icon={propertiesIcon}
        iconAlt="properties icon"
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="heading-table heading-table--top">
            <h2 className="heading-table__title">{residence?.name}</h2>
          </div>
          <Table headings={tableHeadings} data={tableData} />
        </>
      )}
    </Dashboard>
  );
}
