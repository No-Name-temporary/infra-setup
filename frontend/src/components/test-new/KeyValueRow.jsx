import { React } from 'react';
import TextInput from '../shared/TextInput';

function HeaderRow({ kv }) {
  return (
    <div className="flex items-center">
      <div className="flex-1 pr-2">
        <TextInput label="" value={kv.name} type="text" name="test_name" id="test_name" />
      </div>
      <div className="flex-1 pl-2">
        <TextInput label="" value={kv.value} type="text" name="test_name" id="test_name" />
      </div>
      <div>
        <div className="pl-2">
          <img
            className="h-6 w-auto"
            src="https://img.icons8.com/external-others-iconmarket/344/external-delete-essential-others-iconmarket-3.png"
            alt="NoName"
          />
        </div>
      </div>
    </div>
  );
}

export default HeaderRow;
