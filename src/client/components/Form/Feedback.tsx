import React from 'react';

type Props = {
  text?: string;
};

export default function Feedback({ text }: Props): JSX.Element {
  return <p style={{ color: 'red' }}>{text || ' '}</p>;
}
