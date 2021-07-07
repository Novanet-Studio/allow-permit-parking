import React from 'react';

import { PropertyModal } from '../Modal';

import useModal from '../../hooks/use-modal';
import useParkingLot from '../../hooks/use-parking-lot';

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
  const { createParkingLot } = useParkingLot();

  const onAddApartments = async (
    e,
    data: [{ name: string }],
    parkingLotId: string,
  ) => {
    try {
      const parkingLots = data.map(
        async (data) =>
          await createParkingLot(parkingLotId, { name: data.name }),
      );

      const response = await Promise.all(parkingLots);
      const dataResponse = response.map((value) => value.data);

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
