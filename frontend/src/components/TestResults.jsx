import { React, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../services/ApiClient';

function TestResults() {
  const testId = useParams().id;

  const [results, setResults] = useState([]);

  const getTestHook = () => {
    const run = async () => {
      try {
        const test = await apiClient.getTest(testId);
        setResults(test);
      } catch (err) {
        console.log(err);
      }
    };
    run();
  };

  useEffect(getTestHook, []);

  return (
    <div>
      <Link to="/">
        <button type="button">Home</button>
      </Link>
      <h1>TestsResults</h1>

      {results.map((item) => (
        <div key={item.id}>
          {JSON.stringify(item)}
        </div>
      ))}
    </div>
  );
}

export default TestResults;
