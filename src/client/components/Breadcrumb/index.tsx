import React from 'react';
import { useRouter } from 'next/router';

import backIcon from '../../assets/images/app_icon_back.svg';

type Props = {
  text?: string;
};

export default function Breadcrumb({ text = 'Back' }: Props): JSX.Element {
  const router = useRouter();

  const handleBack = () => router.replace('/');

  return (
    <div className="breadcrumb" onClick={handleBack}>
      <img className="breadcrumb__icon" src={backIcon} alt="back icon" />
      <p className="breadcrumb__text">{text}</p>
    </div>
  );
}
