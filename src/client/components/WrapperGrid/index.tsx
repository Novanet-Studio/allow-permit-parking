import React from 'react';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export default function WrapperGrid({ children }: Props): JSX.Element {
  return (
    <div className="wrapper-grid">
      <div className="wrapper-grid__half">{children}</div>
    </div>
  );
}
