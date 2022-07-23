import React from 'react';

function RadioButtons({ frequency, handleFrequency }) {
  return (
    <div>
      <h2>How frequently should the test run?</h2>
      <div>
        <input
          type="radio"
          value="1"
          checked={frequency === '1'}
          onChange={handleFrequency}
        />
        1 minute
      </div>
      <div>
        <input
          type="radio"
          value="10"
          checked={frequency === '10'}
          onChange={handleFrequency}
        />
        10 minutes
      </div>
      <div>
        <input
          type="radio"
          value="15"
          checked={frequency === '15'}
          onChange={handleFrequency}
        />
        15 minutes
      </div>
    </div>
  );
}

export default RadioButtons;
