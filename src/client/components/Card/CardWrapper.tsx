import React from 'react';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export default function CardWrapper({ children }: Props): JSX.Element {
  return <ul className="card">{children}</ul>;
}
