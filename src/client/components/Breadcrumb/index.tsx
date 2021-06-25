import React from 'react';

import backIcon from '../../assets/images/app_icon_back.svg';

type Props = {
  text?: string;
};

export default function Breadcrumb({ text = 'back' }: Props): JSX.Element {
  return (
    <a href="/" className="breadcrumb">
      <img className="breadcrumb__icon" src={backIcon} alt="back icon" />
      <p className="breadcrump__text">{text}</p>
    </a>
  );
}
