import React, { useState } from 'react';

import Button from '../Button';
import Modal from './Modal';

import addIcon from '../../assets/images/app_icon_add.svg';
import deleteIcon from '../../assets/images/app_icon_delete.svg';

import type { MouseEvent, ChangeEvent } from 'react';

type Props = {
  title: string;
  inputLabel: string;
  buttonText: string;
  isOpenModal: boolean;
  onUpdate(event: MouseEvent<HTMLSpanElement>, data?: unknown): void;
  closeModal: () => void;
};

type BuildingForm = {
  name: string;
};

const initialState = [
  {
    name: '',
  },
];

export default function PropertyModal({
  inputLabel,
  buttonText,
  ...props
}: Props): JSX.Element {
  const [inputs, setInputs] = useState<BuildingForm[]>(initialState);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { name, value } = e.currentTarget;
    const list = [...inputs];
    list[index][name] = value;
    setInputs(list);
  };

  const handleRemove = (index: number) => {
    const list = [...inputs];
    list.splice(index, 1);
    setInputs(list);
  };

  const handleClick = () => {
    setInputs([...inputs, { name: '' }]);
  };

  const reset = () => setInputs(initialState);

  return (
    <Modal
      {...props}
      onUpdate={(e) => {
        props.onUpdate(e, inputs);
        reset();
      }}
    >
      <form className="form form--one-column">
        {inputs.map((input, index) => (
          <div className="form__group form__group--full" key={index}>
            <label className="form__label">{inputLabel}</label>
            <input
              name="name"
              className="form__input"
              type="text"
              value={input.name}
              onChange={(e) => handleInputChange(e, index)}
            />
            {inputs.length !== 1 && (
              <button
                className="button button--plus"
                type="button"
                onClick={() => handleRemove(index)}
              >
                <img className="plus__icon" src={deleteIcon} alt="add icon" />
              </button>
            )}
          </div>
        ))}

        <div className="form__group form__group--full">
          <div className="plus plus--modal-mode">
            <button
              className="button button--plus"
              type="button"
              onClick={handleClick}
            >
              <img className="plus__icon" src={addIcon} alt="add icon" />
            </button>
          </div>
        </div>

        <div className="form__group form__group--full">
          <Button mode="top" type="button">
            {buttonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
