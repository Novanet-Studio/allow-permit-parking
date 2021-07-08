import React from 'react';
import { useRouter } from 'next/router';

import listIcon from '../../assets/images/app_icon_list.svg';
import pencilIcon from '../../assets/images/app_icon_pencil.svg';

type TableData = {
  id: string;
  propertyName: string;
  systemType: string;
  apartments: number;
  parkingSpaces: number;
  permitSpaces: number;
  reservedSpaces: number;
  visitorSpaces: number;
};

type Props = {
  headings: string[];
  data: TableData[];
};

export default function Table<T>({ headings, data }: Props): JSX.Element {
  const router = useRouter();

  const handleClickEdit = (id: string) => {
    router.push({
      pathname: '/property-detail',
      query: {
        residenceId: id,
      },
    });
  };

  const handleClickDetails = () => {};

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
      {data.length === 1
        ? data.map((item, index) => (
            <ul className="table__row" key={index}>
              <li className="table__data">{item.systemType}</li>
              <li className="table__data">{item.apartments}</li>
              <li className="table__data">{item.parkingSpaces}</li>
              <li className="table__data">{item.permitSpaces}</li>
              <li className="table__data">{item.reservedSpaces}</li>
              <li className="table__data">{item.visitorSpaces}</li>
            </ul>
          ))
        : data.map((item, index) => (
            <ul className="table__row" key={index}>
              <li className="table__data">{item.propertyName}</li>
              <li className="table__data">{item.systemType}</li>
              <li className="table__data">{item.apartments}</li>
              <li className="table__data">{item.parkingSpaces}</li>
              <li className="table__data">{item.visitorSpaces}</li>
              <li className="table__data">
                <button
                  className="button button--table button--orange"
                  onClick={() => handleClickDetails}
                >
                  <img
                    className="button__icon"
                    src={listIcon}
                    alt="list icon"
                  />
                </button>
                <button
                  className="button button--table button--green"
                  onClick={() => handleClickEdit(item.id)}
                >
                  <img
                    className="button__icon"
                    src={pencilIcon}
                    alt="pencil icon"
                  />
                </button>
              </li>
            </ul>
          ))}
    </div>
  );
}
