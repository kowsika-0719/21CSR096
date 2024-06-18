import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [numberType, setNumberType] = useState('p');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNumberTypeChange = (e) => {
    setNumberType(e.target.value);
  };

  const fetchNumbers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:9876/numbers/${numberType}`);
      setResponseData(response.data);
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Average Calculator Microservice</h1>
        <div className="controls">
          <label htmlFor="numberType">Select Number Type: </label>
          <select id="numberType" value={numberType} onChange={handleNumberTypeChange}>
            <option value="p">Prime</option>
            <option value="f">Fibonacci</option>
            <option value="e">Even</option>
            <option value="r">Random</option>
          </select>
          <button onClick={fetchNumbers}>Fetch Numbers</button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {responseData && (
          <div className="response">
            <h2>API Response</h2>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
