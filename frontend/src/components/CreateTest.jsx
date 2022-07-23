import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './form-components/Dropdown';
import RadioButtons from './form-components/RadioButtons';
import apiClient from '../services/ApiClient';
import { namesToCamelCase } from '../utils/helpers';

function CreateTest() {
  const [locations, setLocations] = useState([]);
  const [sourceValue, setSourceValue] = useState('jsonBody');
  const [comparisonTypes, setComparisonTypes] = useState([]);
  const [assertionTypes, setAssertionTypes] = useState([]);
  const [methods, setMethods] = useState([]);

  const getSideloadHook = () => {
    const run = async () => {
      const sideload = await apiClient.getSideload();

      setLocations(sideload.regions);
      setComparisonTypes(sideload.comparisonTypes);
      setAssertionTypes(namesToCamelCase(sideload.assertionTypes));
      setMethods(sideload.httpMethods);
    };
    run();
  };

  useEffect(getSideloadHook, []);

  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('1');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://example-website.com');
  const [body, setBody] = useState('');
  const [property, setProperty] = useState('');
  const [target, setTarget] = useState('');
  const [locationValue, setLocationValue] = useState('us-west-1');
  const [comparisonValue, setComparisonValue] = useState('equal_to');

  const resetValues = () => {
    setMethod('GET');
    setLocationValue('us-west-1');
    setSourceValue('statusCode');
    setComparisonValue('equal_to');
    setTitle('');
    setFrequency('1');
    setUrl('');
    setBody('');
    setProperty('');
    setTarget('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const testData = {
      test: {
        title,
        locations: [locationValue],
        minutesBetweenRuns: Number(frequency),
        type: 'API',
        httpRequest: {
          method,
          url,
          headers: {},
          body: JSON.parse(body === '' ? '{}' : body),
          assertions: {
            [sourceValue]: {
              comparison: comparisonValue,
              property,
              target,
            },
          },
        },
      },
    };

    console.log(testData);
    const data = await apiClient.createTest(testData);
    console.log(data);

    resetValues();
  };

  const handleRunTestNow = async (event) => {
    event.preventDefault();

    const testData = {
      test: {
        title,
        locations: [locationValue],
        minutesBetweenRuns: 0,
        type: 'API',
        httpRequest: {
          method,
          url,
          headers: {},
          body: JSON.parse(body === '' ? '{}' : body),
          assertions: {
            [sourceValue]: {
              comparison: comparisonValue,
              property,
              target,
            },
          },
        },
      },
    };

    const data = await apiClient.runTestNow(testData);
    console.log(data);
    console.log("run now button doesn't have an endpoint yet");
    resetValues();
  };

  const handleUpdateLocation = (event) => {
    setLocationValue(event.target.value);
  };

  const handleUpdateSource = (event) => {
    setSourceValue(event.target.value);
  };

  const handleUpdateComparison = (event) => {
    setComparisonValue(event.target.value);
  };

  const handleUpdateFrequency = (event) => {
    setFrequency(event.target.value);
  };

  const handleUpdateTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleUpdateMethod = (event) => {
    setMethod(event.target.value);
  };

  const handleUpdateUrl = (event) => {
    setUrl(event.target.value);
  };

  const handleUpdateBody = (event) => {
    setBody(event.target.value);
  };

  const handleUpdateProperty = (event) => {
    setProperty(event.target.value);
  };

  const handleUpdateTarget = (event) => {
    setTarget(event.target.value);
  };

  return (
    <div>
      <Link to="/">
        <button type="button">Home</button>
      </Link>
      <div>
        <button className="button" type="button" onClick={handleRunTestNow}>
          Run Now
        </button>
      </div>
      <h1>Create an API test</h1>
      <form onSubmit={handleSubmit}>
        <dl>
          <dt>Test Name</dt>
          <dd>
            <input
              type="text"
              placeholder="Eneter name..."
              value={title}
              onChange={handleUpdateTitle}
            />
          </dd>
          <h2>Make an HTTP request</h2>
          <Dropdown
            label="Method"
            options={methods}
            value={method}
            onChange={handleUpdateMethod}
          />
          <dt>URL</dt>
          <dd>
            <input
              type="text"
              placeholder="https://example-website.com"
              value={url}
              onChange={handleUpdateUrl}
            />
          </dd>
          <Dropdown
            label="Location"
            options={locations}
            value={locationValue}
            onChange={handleUpdateLocation}
          />
          <dt>Body</dt>
          <dd>
            <textarea
              type="textarea"
              placeholder="Enter JSON body..."
              value={body}
              onChange={handleUpdateBody}
            />
          </dd>
          <h2>Add assertions</h2>
          <Dropdown
            label="Source"
            options={assertionTypes}
            value={sourceValue}
            onChange={handleUpdateSource}
          />
          <dt>Property</dt>
          <dd>
            <input
              type="text"
              placeholder=""
              value={property}
              onChange={handleUpdateProperty}
            />
          </dd>
          <Dropdown
            label="Comparison"
            options={comparisonTypes}
            value={comparisonValue}
            onChange={handleUpdateComparison}
          />
          <dt>Target</dt>
          <dd>
            <input
              type="text"
              placeholder=""
              value={target}
              onChange={handleUpdateTarget}
            />
          </dd>
          <RadioButtons frequency={frequency} handleFrequency={handleUpdateFrequency} />
        </dl>
        <button className="button" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateTest;
