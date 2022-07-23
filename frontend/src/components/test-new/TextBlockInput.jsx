import { React, useState } from 'react';
import CodeInput from './CodeInput';

function TextBlockInput({
  label, placeholder, name, id,
}) {
  const [checkedOption, setCheckedOption] = useState('json');

  const handleToggleShowBody = (e) => {
    setCheckedOption(e.target.value);
  };

  return (
    <div className="mt-6">
      <h2>{label}</h2>
      <div className="flex">
        <div>
          <input onChange={handleToggleShowBody} type="radio" name="body" id="none" value="none" checked={checkedOption === 'none'} />
          <label className="ml-2" htmlFor="none">None</label>
        </div>
        <div className="px-2">
          <input onChange={handleToggleShowBody} type="radio" name="body" id="json" value="json" checked={checkedOption === 'json'} />
          <label className="ml-2" htmlFor="json">JSON</label>
        </div>
      </div>
      { checkedOption === 'json' ? <CodeInput /> : ''}
    </div>
  );
}

export default TextBlockInput;
