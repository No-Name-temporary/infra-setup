import { React } from 'react';

function RegionCard({ region }) {
  return (
    <div className="grid justify-items-center rounded border text-gray-900 hover:bg-gray-300">
      <div className="flex items-center">
        <div className="w-8 ml-2 pr-2">
          <img src={region.flagUrl} alt={region.name} />
        </div>
        <div className="text-center">
          <div className="text-gray-900">{region.displayName}</div>
          <div className="text-sm">{region.awsName}</div>
        </div>
      </div>
    </div>
  );
}

export default RegionCard;
