import React from 'react';

import type { MouseEvent } from 'react';

import plusIcon from '../../assets/images/app_icon_add.svg';

type Props = {
  children?: JSX.Element | JSX.Element[] | string;
  type?: 'button' | 'submit';
  mode?: 'big' | 'small' | 'plus' | 'top';
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export default function Button({
  children,
  mode,
  type = 'button',
  onClick,
}: Props): JSX.Element {
  return mode === 'plus' ? (
    <div className="plus">
      <button className="button button--plus" type={type} onClick={onClick}>
        <img className="plus__icon" src={plusIcon} alt="add icon" />
      </button>
    </div>
  ) : (
    <button
      className={`button ${mode ? `button--${mode}` : ''} `}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
