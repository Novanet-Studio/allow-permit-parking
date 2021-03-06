import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import Success from '../components/Success';
import Dashboard from '../components/DashboardLayout';
import Breadcrumb from '../components/Breadcrumb';
import Subheader from '../components/Subheader';
import { EditTable, Table } from '../components/Table';
import { Modal } from '../components/Modal';

import useModal from '../hooks/use-modal';
import useRequest from '../hooks/use-request';
import useGenerateInput from '../hooks/use-generate-input';

import propertiesIcon from '../assets/images/app_icon_properties.svg';
import deleteIcon from '../assets/images/app_icon_delete.svg';

import type { AxiosRequestConfig } from 'axios';
import type { ESW } from '../../@types/esw';
import Loader from '../components/Loader';
import filterBuildingById from '../utils/filterBuildingById';

const Request: AxiosRequestConfig = {
  method: 'GET',
};

type RequestType =
  | ESW.Residence[]
  | ESW.Building[]
  | ESW.ParkingLot[]
  | ESW.ParkingSlot[]
  | ESW.ParkingSlot;

export default function PropertyDetail(): JSX.Element {
  const router = useRouter();
  const inputRename = useRef<HTMLInputElement>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [residence, setResidence] = useState(null);
  const [buildings, setBuildings] = useState<ESW.Building[]>(null);
  const [parkingSlots, setParkingSlots] = useState<ESW.ParkingSlot[]>(null);
  const [tableData, setTableData] = useState(null);
  const { execute, isLoading } = useRequest<RequestType>(Request);
  const {
    isOpenModal: isOpenModalRename,
    openModal: openModalRename,
    closeModal: closeModalRename,
  } = useModal(false);
  const {
    isOpenModal: isOpenModalApartments,
    openModal: openModalApartments,
    closeModal: closeModalApartments,
  } = useModal(false);
  const {
    isOpenModal: isOpenConfirmationModal,
    openModal: openConfirmationModal,
    closeModal: closeConfirmationModal,
  } = useModal(false);
  const {
    inputs,
    handleInputChange,
    handleRemove,
    updateInputs,
  } = useGenerateInput<{ name: string; id?: string }>({ name: '' });

  useEffect(() => {
    const getProperties = async () => {
      if (confirm) {
        return;
      }

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

      const filterApartments = apartments.filter((apartment) =>
        buildingId.includes(apartment.buildingId),
      );

      const filterParkingSpaces = parkingSlots.filter(
        (slot) => slot.residenceId === residence.id,
      );

      const totalApartments = filterApartments.length;
      const totalParkingSpaces = filterParkingSpaces.length;

      const filterBuildings = buildings.filter(
        (building) => building.residenceId === residence.id,
      );

      setBuildings(filterBuildings);
      updateInputs(filterApartments);
      setParkingSlots(filterParkingSpaces);

      setTableData([
        {
          propertyName: residence.name,
          systemType: 'permit',
          apartments: totalApartments,
          parkingSpaces: totalParkingSpaces,
          permitSpaces: 0,
          reservedSpaces: 0,
          visitorSpaces: 0,
        },
      ]);
    };

    const removeProperty = async () => {
      const apartments = inputs;
      console.log('Remove Done!');
      buildings.map(
        async (building) =>
          await execute(`api/v1/building/${building.id}`, null, {
            method: 'DELETE',
          }),
      );
      apartments.map(
        async (apartment) =>
          await execute(`api/v1/parking/lots/${apartment.id}`, null, {
            method: 'DELETE',
          }),
      );
      parkingSlots.map(
        async (parkingSlot) =>
          await execute(`api/v1/parking/slots/${parkingSlot.id}`, null, {
            method: 'DELETE',
          }),
      );

      const deleted = await execute(`api/v1/residence/${residence.id}`, null, {
        method: 'DELETE',
      });

      if (deleted.status === 200) {
        setIsSuccess(true);
      }
    };

    if (confirm) {
      removeProperty();
    }

    getProperties();
  }, [confirm]);

  const tableHeadings = [
    'System type',
    'Apartments',
    'Parking spaces',
    'Permit active',
    'Reserved active',
    'Visitor',
  ];

  const onRenameProperty = async () => {
    const value = inputRename.current.value;

    if (!value) {
      return;
    }

    const response = await execute(
      `api/v1/residence/${residence.id}`,
      { name: value },
      { method: 'PUT' },
    );

    setResidence(response.data);
    closeModalRename();
  };

  const onUpdateApartments = async () => {
    const inputsPromise = inputs.map(
      async (input) =>
        await execute(
          `api/v1/parking/lots/${input.id}`,
          { name: input.name },
          { method: 'PUT' },
        ),
    );

    await Promise.all(inputsPromise);
    closeModalApartments();
  };

  const openModalParkingLots = () => {
    if (!buildings.length) {
      return;
    }
    openModalApartments();
  };

  const onRemoveBuilding = async (id: string) => {
    const apartments = inputs;

    await apartments.map(
      async (aparment) =>
        await execute(`api/v1/parking/lots/${aparment.id}`, null, {
          method: 'DELETE',
        }),
    );

    await execute(`api/v1/building/${id}`, null, { method: 'DELETE' });
    const response = await execute('api/v1/building', null, { method: 'GET' });
    const buildings = (await response.data) as ESW.Building[];
    const buildingFilter = buildings.filter((building) => building.residenceId === residence.id);

    if (!buildingFilter.length) {
      closeModalApartments();
      return;
    }

    setBuildings(buildingFilter);
  };

  if (isSuccess) {
    return (
      <Success
        isSuccess={isSuccess}
        content={`Property "${residence.name}" was deleted successfully`}
      />
    );
  }

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
        <div className="detail">
          <div className="detail__left">
            <h2 className="detail__title">{residence?.name}</h2>
            <p className="detail__text">ESW parking properties</p>
            <p className="detail__subtext">You can update fields</p>
            <ul className="detail__menu">
              <li className="detail__links" onClick={openModalRename}>
                Rename property
              </li>
              {/* <li className="detail__links">Update property map</li> */}
              <li className="detail__links" onClick={openModalParkingLots}>
                Update apartments
              </li>
              {/* <li className="detail__links">Manage Parking</li> */}
              {/* <li className="detail__links">Update status</li> */}
              {/* <li className="detail__links">Propety manager access</li> */}
              {/* <li className="detail__links">Reset property</li> */}
              <li
                className="detail__links"
                onClick={() => {
                  openConfirmationModal();
                }}
              >
                Delete property
              </li>
            </ul>
            <Modal
              title="Rename property"
              isOpenModal={isOpenModalRename}
              closeModal={closeModalRename}
              onUpdate={onRenameProperty}
              showButtons
            >
              <div className="form__group">
                <label className="form__label">Property name</label>
                <input className="form__input" ref={inputRename} type="text" />
              </div>
            </Modal>
            <Modal
              title="Update apartments"
              isOpenModal={isOpenModalApartments}
              closeModal={closeModalApartments}
              onUpdate={onUpdateApartments}
              showButtons
            >
              {buildings?.length && (
                <EditTable
                  headings={['Building ID', 'Apartments', 'Actions']}
                  data={buildings}
                  residenceId={residence.id}
                  onRemoveBuilding={onRemoveBuilding}
                />
              )}
            </Modal>
            <Modal
              title="Property delete confirmation"
              isOpenModal={isOpenConfirmationModal}
              closeModal={closeConfirmationModal}
              onUpdate={() => {}}
            >
              <div className="form__group form__group--full">
                <p style={{ textAlign: 'center' }}>
                  Are you sure to delete <b>{residence?.name}</b>?
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    style={{
                      marginRight: '1em',
                    }}
                    className="button button--red"
                    type="button"
                    onClick={() => {
                      setConfirm(false);
                      closeConfirmationModal();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="button"
                    type="button"
                    onClick={() => setConfirm(true)}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </Modal>
          </div>
          <div className="detail__right">
            <Table headings={tableHeadings} data={tableData} />
          </div>
        </div>
      )}
    </Dashboard>
  );
}
