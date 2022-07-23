import { React } from 'react';
import { useSelector } from 'react-redux';
import RegionCard from './RegionCard';

function LocationsInput() {
  const regions = useSelector((state) => state.sideloads.regions);

  if (regions) {
    return (
      <div className="mt-8">
        <h2>Locations</h2>
        <div className="mt-4 grid grid-cols-5 gap-4">
          { regions.map((region) => <RegionCard key={region.id} region={region} />)}
        </div>
      </div>
    );
  }
}

export default LocationsInput;
