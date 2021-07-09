import React, { useEffect } from 'react';

import Modal from './Modal';
import useRequest from '../../hooks/use-request';
import useGenerateInput from '../../hooks/use-generate-input';

import deleteIcon from '../../assets/images/app_icon_delete.svg';

import type { MouseEvent } from 'react';
import type { ESW } from '../../../@types/esw';

type Props = {
  title: string;
  inputLabel: string;
  buildingId: string;
  residenceId: string;
  isOpenModal: boolean;
  onUpdate(event: MouseEvent<HTMLSpanElement>, data?: unknown): void;
  closeModal: () => void;
};

type BuildingForm = {
  id: string;
  name: string;
};

export default function EditModal({
  inputLabel,
  buildingId,
  ...props
}: Props): JSX.Element {
  const { execute } = useRequest<ESW.ParkingLot | ESW.ParkingLot[]>({
    method: 'DELETE',
  });
  const {
    inputs,
    updateInputs,
    handleInputChange,
    handleRemove,
    reset,
  } = useGenerateInput<BuildingForm>({ id: '', name: '' });

  useEffect(() => {
    const getParkingLots = async () => {
      const response = await execute('api/v1/parking/lots', null, {
        method: 'GET',
      });
      const parkingLots = response.data as ESW.ParkingLot[];

      const filterParkingLots = parkingLots.filter(
        (parkingLots) => parkingLots.buildingId === buildingId,
      );

      updateInputs(filterParkingLots);
    };

    getParkingLots();
  }, []);

  const removeParkingLot = async (id: string) => {
    const result = await execute(`api/v1/parking/lots/${id}`);
    const response = result.data as ESW.ParkingLot;

    updateInputs(inputs.filter((input) => input.id !== response.id));
  };

  return (
    <Modal
      {...props}
      onUpdate={(e) => {
        props.onUpdate(e, inputs);
        reset();
      }}
      showButtons={true}
    >
      <form className="form form--one-column">
        {inputs?.map((input, index) => (
          <div className="form__group form__group--full" key={index}>
            <label className="form__label">{inputLabel}</label>
            <div style={{ display: 'flex' }}>
              <input
                name="name"
                className="form__input"
                type="text"
                value={input.name}
                onChange={(e) => handleInputChange(e, index)}
              />
              <button
                className="button button--plus"
                type="button"
                onClick={() => {
                  handleRemove(index);
                  removeParkingLot(input.id);
                }}
              >
                <img className="plus__icon" src={deleteIcon} alt="add icon" />
              </button>
            </div>
          </div>
        ))}
      </form>
    </Modal>
  );
}
