import React from 'react';

import listIcon from '../../assets/images/app_icon_list.svg';
import pencilIcon from '../../assets/images/app_icon_pencil.svg';

type TableData = {
  propertyName: string;
  systemType: string;
  apartments: number;
  parkingSpaces: number;
  visitorSpaces: number;
};

type Props = {
  headings: string[];
  data: TableData[];
};

export default function Table<T>({ headings, data }: Props): JSX.Element {
  if (!data || !data.length) {
    return null;
  }

  return (
    <div className="table">
      <ul className="table__head">
        {headings.map((heading, index) => (
          <li className="table__data" key={index}>
            <h4>{heading}</h4>
          </li>
        ))}
      </ul>
      {data.map((item, index) => (
        <ul className="table__row" key={index}>
          <li className="table__data">{item.propertyName}</li>
          <li className="table__data">{item.systemType}</li>
          <li className="table__data">{item.apartments}</li>
          <li className="table__data">{item.parkingSpaces}</li>
          <li className="table__data">{item.visitorSpaces}</li>
          <li className="table__data">
            <a>
              <button className="button button--table button--orange">
                <img className="button__icon" src={listIcon} alt="list icon" />
              </button>
            </a>
            <a>
              <button className="button button--table button--green">
                <img
                  className="button__icon"
                  src={pencilIcon}
                  alt="pencil icon"
                />
              </button>
            </a>
          </li>
        </ul>
      ))}
    </div>
  );
}
