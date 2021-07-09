import React, { useEffect } from 'react';

import useModal from '../../hooks/use-modal';
import { useRouter } from 'next/router';
import { Modal } from '../Modal';

type Props = {
  isSuccess: boolean;
  content: string;
  title?: string;
  time?: number;
};

export default function Success({
  isSuccess,
  content,
  title = '¡Success!',
  time = 3000,
}: Props): JSX.Element {
  const { isOpenModal, openModal, closeModal } = useModal(false);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      openModal();
      setTimeout(() => {
        closeModal();
        router.replace('/');
      }, time);
    }
  }, [isSuccess]);

  return (
    <Modal
      isOpenModal={isOpenModal}
      closeModal={closeModal}
      onUpdate={() => {}}
      title={title}
    >
      <p>{content}</p>
    </Modal>
  );
}
