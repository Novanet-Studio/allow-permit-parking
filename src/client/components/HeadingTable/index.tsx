import React from 'react';

type Props = {
  title?: string;
  subtitle?: string;
  mode?: 'top';
};

export default function HeadingTable({
  title,
  subtitle,
  mode,
}: Props): JSX.Element {
  return (
    <div className={`heading-table ${mode ? `heading-table--${mode}` : ''}`}>
      {title && <h2 className="heading-table__title">{title}</h2>}
      {subtitle && <h3 className="heading-table__subtitle">{subtitle}</h3>}
    </div>
  );
}
