/* eslint-disable react/prop-types */
import React from 'react';

function Dropdown({
  label, value, options, onChange,
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        <select value={value} onChange={onChange}>
          {options.map((option) => (
            // eslint-disable-next-line react/no-array-index-key
            <option key={`${option.display_name}${option.id}`} value={option.name}>{option.display_name}</option>
          ))}
        </select>
      </dd>
    </div>
  );
}

export default Dropdown;
