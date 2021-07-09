import React from 'react';

type Props = {
  headings: string[];
};

export default function TableHeading({ headings }: Props): JSX.Element {
  return (
    <ul className="table__head">
      {headings.map((heading, index) => (
        <li className="table__data" key={index}>
          <h4>{heading}</h4>
        </li>
      ))}
    </ul>
  );
}
