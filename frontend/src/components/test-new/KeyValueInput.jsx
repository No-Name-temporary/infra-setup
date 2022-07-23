import { React } from 'react';
import KeyValueRow from './KeyValueRow';

function KeyValueInput({ label, buttonLabel, data }) {
  return (
    <div className="py-5">
      <h2>{label}</h2>
      <div>
        {data.map((kvPair) => <KeyValueRow kv={kvPair} />)}
      </div>
      <button type="button" className="text-sm font-medium text-sky-600 hover:text-sky-700">
        +
        {' '}
        {buttonLabel}
      </button>
    </div>
  );
}

export default KeyValueInput;
