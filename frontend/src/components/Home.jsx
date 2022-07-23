import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/ApiClient';
import TestRow from './TestRow';

function Home() {
  const [tests, setTests] = useState([]);

  const getAllTestsHook = () => {
    const run = async () => {
      const testsRecords = await apiClient.getTests();
      setTests(testsRecords);
    };
    run();
  };

  useEffect(getAllTestsHook, []);

  return (
    <div>
      <Link to="/create/test">
        <button type="button">Create New</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          { tests.map((test) => <TestRow key={test.id} data={test} />)}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
