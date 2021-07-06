import React from 'react';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  const handleAddRoute = () => router.replace(addLink);
  const handleManagerRoute = () => router.replace(manageLink);

  return (
    <li className="card__box">
      <div className="card__heading">
        <img className="card__icon" src={icon} alt="dashboard icon" />
        <h3 className="card__title">{title}</h3>
      </div>
      <div className="card__link" onClick={handleAddRoute}>
        {addText}
      </div>
      <div className="card__link" onClick={handleManagerRoute}>
        {manageText}
      </div>
    </li>
  );
}
