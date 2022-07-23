import { React } from 'react';

function Select({
  label, placeholder, name, id, options, onChange,
}) {
  if (options) {
    return (
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">
          { label }
        </label>
        <div className="mt-1">
          <select
            name={name}
            id={id}
            className="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder={placeholder}
            onChange={onChange}
          >
            { options.map((option) => <option>{option.displayName}</option>)}
          </select>
        </div>
      </div>
    );
  }
}

export default Select;
