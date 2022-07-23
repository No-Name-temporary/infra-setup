import { React } from 'react';

const CHECK_MARK_ICON = 'https://img.icons8.com/color/344/checked--v1.png';
const X_ICON = 'https://img.icons8.com/color/344/cancel--v1.png';

function Table({ testRuns }) {
  return (
    <div className="mt-8 flex flex-col">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900" />
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
            >
              Location
            </th>
            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
              Response time
            </th>
            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
              Assertions passed
            </th>
            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {testRuns.map((testRun) => (
            <tr key={testRun.id}>
              <td>
                <div className="w-6 ml-2"><img src={testRun.success ? CHECK_MARK_ICON : X_ICON} /></div>
              </td>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                <div className="flex">
                  {testRun.location}
                  <div className="object-contain w-6 ml-2"><img src={testRun.region.flagUrl} /></div>
                </div>
              </td>
              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{testRun.status}</td>
              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                {testRun.responseTimeMs}
                ms
              </td>
              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                {testRun.assertionsPassed}
                /
                {testRun.assertions}
              </td>
              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{testRun.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
