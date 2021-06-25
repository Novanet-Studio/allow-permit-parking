import React from 'react';

export default function Table(): JSX.Element {
  return (
    <div className="table">
      <ul className="table__head">
        <li className="table__data">
          <h4>Building ID</h4>
        </li>
        <li className="table__data">
          <h4>Apartments</h4>
        </li>
      </ul>
      <ul className="table__row">
        <li className="table__data">LS-1</li>
        <li className="table__data">
          <button className="button button--table">
            <a className="button__link">Add</a>
          </button>
        </li>
      </ul>
    </div>
  );
}
