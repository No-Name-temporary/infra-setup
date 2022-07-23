import { React } from 'react';

function TextInput({
  label, placeholder, type, name, id, value, onChange, onBlur,
}) {
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        { label }
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={name}
          id={id}
          className="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}

export default TextInput;
