import { React } from 'react';

function AssertionRow({
  source, property, comparison, target,
}) {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {source}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {property}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {comparison}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {target}
      </td>
      <td>
        <div className="pl-2">
          <img
            className="h-6 w-auto"
            src="https://img.icons8.com/external-others-iconmarket/344/external-delete-essential-others-iconmarket-3.png"
            alt="NoName"
          />
        </div>
      </td>
    </tr>
  );
}

export default AssertionRow;
