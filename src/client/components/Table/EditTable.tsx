import React from 'react';

import TableHeading from './TableHeading';
import { EditModal } from '../Modal';

import useModal from '../../hooks/use-modal';
import useRequest from '../../hooks/use-request';

import type { ESW } from '../../../@types/esw';

type Props = {
  headings: string[];
  data: ESW.Building[];
  residenceId: string;
  onRemoveBuilding: (id: string) => void;
};

export default function EditTable({ headings, data, residenceId, onRemoveBuilding }: Props): JSX.Element {
  const {
    isOpenById,
    openModalById,
    closeModalById,
    closeAllModals,
  } = useModal(false);
  const { execute } = useRequest<ESW.ParkingLot>({
    method: 'DELETE',
  });

  const onRemoveApartments = async (
    e,
    data: [{ name: string }],
    buildingId: string,
  ) => {
    try {
      const parkingLots = data.map(
        async () =>
          await execute(`api/v1/parking/lots/${buildingId}`),
      );      

      const response = await Promise.all(parkingLots);

      console.log(response);

      closeAllModals();
    } catch (error) {
      throw new Error(error);
    } finally {
      closeAllModals();
    }
  };

  if (!data || !data.length) {
    return null;
  }

  return (
    <div className="table">
      <TableHeading headings={headings} />
      {data.map((building) => (
        <ul className="table__row" key={building.id}>
          <li className="table__data">{building.name}</li>
          <li className="table__data">
            <button
              className="button button--table"
              onClick={() => openModalById(building.id)}
            >
              <a className="button__link">Update</a>
            </button>
          </li>
          <li className="table__data">
            <button
              style={{ backgroundColor: '#e83939' }}
              className="button button--table"
              onClick={() => onRemoveBuilding(building.id)}
            >
              &times;
            </button>
          </li>
          <EditModal
            title={`Update apartments for ${building.name}`}
            inputLabel="Apartment name"
            isOpenModal={isOpenById[building.id]}
            closeModal={() => closeModalById(building.id)}
            onUpdate={(e, data: [{ name: string }]) =>
              onRemoveApartments(e, data, building.id)
            }
            residenceId={residenceId}
            buildingId={building.id}
            key={Date.now()}
          />
        </ul>
      ))}
    </div>
  );
}
