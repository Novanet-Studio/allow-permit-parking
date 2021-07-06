import { useState } from 'react';

type OpenByID = {
  [x: string]: boolean;
};

export interface UseModalHook {
  isOpenModal: boolean;
  isOpenById: OpenByID;
  openModal: () => void;
  closeModal: () => void;
  openModalById: (id: string) => void;
  closeModalById: (id: string) => void;
  closeAllModals: () => void;
}

const initialState = { x: false };

export default function useModal(initialValue: boolean): UseModalHook {
  const [isOpenModal, setIsOpenModal] = useState(initialValue);
  const [isOpenById, setIsOpenById] = useState<OpenByID>(initialState);

  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);

  const openModalById = (id: string) => setIsOpenById({ [id]: true });
  const closeModalById = (id: string) => setIsOpenById({ [id]: false });
  const closeAllModals = () => setIsOpenById(initialState);

  return {
    isOpenModal,
    isOpenById,
    openModal,
    openModalById,
    closeModal,
    closeModalById,
    closeAllModals,
  };
}
