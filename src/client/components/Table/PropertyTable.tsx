import React from 'react';

import { PropertyModal } from '../Modal';
import useModal from '../../hooks/use-modal';
import useRequest from '../../hooks/use-request';

import type { ESW } from '../../../@types/esw';

type Props = {
  headings: string[];
  data: ESW.Building[];
  onRemoveBuilding: (id: string) => void;
};

export default function PropertyTable({ headings, data, onRemoveBuilding }: Props): JSX.Element {
  const {
    isOpenById,
    openModalById,
    closeModalById,
    closeAllModals,
  } = useModal(false);
  const { execute } = useRequest<ESW.ParkingLot>({
    method: 'POST',
  });

  const onAddApartments = async (
    e,
    data: [{ name: string }],
    buildingId: string,
  ) => {
    try {
      const parkingLots = data.map(
        async (data) =>
          await execute(`api/v1/parking/lots/${buildingId}`, { name: data.name }),
      );      

      await Promise.all(parkingLots);

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
      <ul className="table__head">
        {headings.map((heading, index) => (
          <li className="table__data" key={index}>
            <h4>{heading}</h4>
          </li>
        ))}
      </ul>
      {data.map((building) => (
        <ul className="table__row" key={building.id}>
          <li className="table__data">{building.name}</li>
          <li className="table__data">
            <button
              className="button button--table"
              onClick={() => openModalById(building.id)}
            >
              <a className="button__link">Add</a>
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
          <PropertyModal
            title={`Add apartments for ${building.name}`}
            inputLabel="Apartment name"
            isOpenModal={isOpenById[building.id]}
            closeModal={() => closeModalById(building.id)}
            onUpdate={(e, data: [{ name: string }]) =>
              onAddApartments(e, data, building.id)
            }
            key={Date.now()}
          />
        </ul>
      ))}
    </div>
  );
}
