import React from 'react';

import useModal from '../../hooks/use-modal';
import useParkingLot from '../../hooks/use-parking-lot';
import { PropertyModal } from '../Modal';

import type { ESW } from '../../../@types/esw';

type Props = {
  headings: string[];
  data: ESW.Building[];
};

export default function PropertyTable({ headings, data }: Props): JSX.Element {
  const {
    isOpenById,
    openModalById,
    closeModalById,
    closeAllModals,
  } = useModal(false);
  const { createParkingLot } = useParkingLot();

  const onUpdateApartments = async (
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

      console.log(dataResponse);

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
          <PropertyModal
            title="Add apartments"
            inputLabel="Apartment name"
            buttonText="Add apartment"
            isOpenModal={isOpenById[building.id]}
            closeModal={() => closeModalById(building.id)}
            onUpdate={(e, data: [{ name: string }]) =>
              onUpdateApartments(e, data, building.id)
            }
            key={Date.now()}
          />
        </ul>
      ))}
    </div>
  );
}
