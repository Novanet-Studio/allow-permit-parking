import React from 'react';

type Props = {
  icon: string;
  title: string;
  iconAlt: string;
};

export default function Subheader({
  icon,
  title,
  iconAlt,
}: Props): JSX.Element {
  return (
    <div className="subheader">
      <img className="subheader__icon" src={icon} alt={iconAlt} />
      <h3 className="subheader__title">{title}</h3>
    </div>
  );
}
