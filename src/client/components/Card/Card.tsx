import React from 'react';
import Link from 'next/link';

type Props = {
  icon: string;
  title: string;
  addText: string;
  addLink: string;
  manageText: string;
  manageLink: string;
};

export default function Card({
  icon,
  title,
  addText,
  addLink,
  manageText,
  manageLink,
}: Props): JSX.Element {
  return (
    <li className="card__box">
      <div className="card__heading">
        <img className="card__icon" src={icon} alt="dashboard icon" />
        <h3 className="card__title">{title}</h3>
      </div>
      <div className="card__link">
        <Link href={addLink}>
          <a>{addText}</a>
        </Link>
      </div>
      <div className="card__link">
        <Link href={manageLink}>
          <a>{manageText}</a>
        </Link>
      </div>
    </li>
  );
}
