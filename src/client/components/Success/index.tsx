import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Modal } from '../Modal';
import useModal from '../../hooks/use-modal';

type Props = {
  isSuccess: boolean;
};

export default function Success({ isSuccess }: Props): JSX.Element {
  const { isOpenModal, openModal, closeModal } = useModal(false);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      openModal();
      setTimeout(() => {
        closeModal();
        router.replace('/');
      }, 5000);
    }
  }, [isSuccess]);

  return (
    <Modal
      isOpenModal={isOpenModal}
      closeModal={closeModal}
      onUpdate={() => {}}
      title="¡Success!"
    >
      <p>Property added successfully</p>
    </Modal>
  );
}
