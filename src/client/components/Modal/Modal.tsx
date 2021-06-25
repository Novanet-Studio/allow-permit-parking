import React, { MouseEvent } from 'react';

type Props = {
  title: string;
  onUpdate(event: MouseEvent<HTMLSpanElement>, data?: unknown): void;
  isOpenModal: boolean;
  closeModal: () => void;
  children: JSX.Element | JSX.Element[];
};

export default function Modal({
  title,
  isOpenModal,
  closeModal,
  children,
  onUpdate,
}: Props): JSX.Element {
  return (
    <div className={`modal ${isOpenModal ? 'modal--show' : ''}`}>
      <div className="modal__content modal__content--middle">
        <div className="modal__heading">
          <h2 className="modal__title">{title}</h2>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__footer">
          <span className="modal__span modal__cancel" onClick={closeModal}>
            cancel
          </span>
          <span className="modal__span modal__update" onClick={onUpdate}>
            update
          </span>
        </div>
      </div>
    </div>
  );
}
