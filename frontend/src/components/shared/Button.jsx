import { React } from 'react';

function Button({ message, save = false }) {
  return (
    <button type="button" className={`${save ? 'bg-green-600 hover:bg-green-600 text-white w-full' : ''} hover:bg-gray-300 px-4 py-1 text-sm font-semibold rounded border text-gray-900`}>
      { message }
    </button>
  );
}

export default Button;
