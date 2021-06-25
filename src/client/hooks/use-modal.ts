import { useState } from 'react';

export interface UseModalHook {
  isOpenModal: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export default function useModal(initialValue: boolean): UseModalHook {
  const [isOpenModal, setIsOpenModal] = useState(initialValue);

  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);

  return { isOpenModal, openModal, closeModal };
}
