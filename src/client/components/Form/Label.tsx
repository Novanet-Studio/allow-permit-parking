import React from 'react';

type Props = {
  htmlFor: string;
  text: string;
};

export default function Label({ htmlFor, text }: Props): JSX.Element {
  return (
    <label className="form__label" htmlFor={htmlFor}>
      {text}
    </label>
  );
}
