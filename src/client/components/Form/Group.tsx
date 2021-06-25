import React from 'react';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export default function Group({ children }: Props): JSX.Element {
  return <div className="form__group form__group--full">{children}</div>;
}
