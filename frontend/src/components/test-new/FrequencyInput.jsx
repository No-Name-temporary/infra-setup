import { React } from 'react';
import TextInput from '../shared/TextInput';
import TextSelect from '../shared/TextSelect';

const unitsOfTime = [
  { displayName: 'minutes' },
  { displayName: 'hours' },
  { displayName: 'days' },
];

function FrequencyInput() {
  return (
    <div className="mt-8">
      <h2>Time between test runs?</h2>
      <div className="mt-4 flex">
        <div className="pr-3">
          <TextInput label="Value" placeholder="#" type="text" name="frequency_value" id="frequency_value" />
        </div>
        <div>
          <TextSelect label="Units" options={unitsOfTime} />
        </div>
      </div>
    </div>
  );
}

export default FrequencyInput;
