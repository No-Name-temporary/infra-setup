import { React } from 'react';
import { useSelector } from 'react-redux';
import TextSelect from '../shared/TextSelect';
import TextInput from '../shared/TextInput';

function NewAssertionRow() {
  const assertionTypes = useSelector((state) => state.sideloads.assertionTypes);
  const comparisonTypes = useSelector((state) => state.sideloads.comparisonTypes);

  return (
    <tr>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        <TextSelect options={assertionTypes} />
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        <TextInput type="text" />
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        <TextSelect options={comparisonTypes} />
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        <TextInput type="text" />
      </td>
      <td>
        Add
      </td>
    </tr>
  );
}

export default NewAssertionRow;
