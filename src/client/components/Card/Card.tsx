import React from 'react';

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
      <a className="card__link" href={addLink}>
        {addText}
      </a>
      <a className="card__link" href={manageLink}>
        {manageText}
      </a>
    </li>
  );
}
