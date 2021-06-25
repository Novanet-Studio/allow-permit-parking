import React from 'react';

import type { ChangeEvent, FocusEvent } from 'react';

type Props = {
  value: string;
  onChange(event: ChangeEvent<HTMLSelectElement>): void;
  onFocus(event: FocusEvent<HTMLSelectElement>): void;
};

export default function Dropdown({
  value,
  onChange,
  onFocus,
}: Props): JSX.Element {
  const handleBlur = (e) => {
    const btn = e.currentTarget.form[2] as HTMLButtonElement;
    btn.click();
  };

  return (
    <div className="dropdown dropdown--full">
      <select
        className="dropdown__group dropdown__group--add"
        name="systemType"
        onChange={onChange}
        onFocus={onFocus}
        onBlur={handleBlur}
      >
        <option className="dropdown__value" value={value} defaultValue="permit">
          System Type:
        </option>
        <option className="dropdown__value" value="permit">
          Permit
        </option>
        <option className="dropdown__value" value="sticker">
          Sticker
        </option>
      </select>
    </div>
  );
}
