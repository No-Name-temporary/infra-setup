import { React } from 'react';
import AssertionRow from './AssertionRow';
import NewAssertionRow from './NewAssertionRow';

const configuredAssertions = [
  {
    id: 1, source: 'Status code', comparison: 'Equal to', target: '200',
  },
  {
    id: 2, source: 'Body', property: '$.title', comparison: 'Equal to', target: 'test board #1',
  },
  {
    id: 3, source: 'Headers', property: '$Content-Type', comparison: 'Equal to', target: 'application/json',
  },
  {
    id: 4, source: 'Response time', comparison: 'Less than', target: '400',
  },
];

function AssertionsInput() {
  return (
    <div className="mt-8 flex flex-col">
      <h2>Assertions</h2>
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
              Source
            </th>
            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
              Property
            </th>
            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
              Comparison
            </th>
            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
              Target
            </th>
            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {configuredAssertions.map((assertion) => (
            <AssertionRow
              key={assertion.id}
              source={assertion.source}
              property={assertion.property}
              comparison={assertion.comparison}
              target={assertion.target}
            />
          ))}
        </tbody>
        <NewAssertionRow />
      </table>
    </div>
  );
}

export default AssertionsInput;
