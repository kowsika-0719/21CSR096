const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 9876;

const WINDOW_SIZE = 10;
let numbersWindow = [];

const thirdPartyApiUrl = "http://localhost:9876/numbers/e"; 

const fetchNumbers = async (numberId) => {
  const maxRetries = 3;
  let attempt = 0;
  let response;

  while (attempt < maxRetries) {
    try {
      response = await axios.get(`${thirdPartyApiUrl}/${numberId}`, { timeout: 500 });
      return response.data.numbers; 
    } catch (error) {
      console.error(`Error fetching numbers on attempt ${attempt + 1}:`, error.message);
      attempt++;
      if (attempt >= maxRetries) {
        return [];
      }
    }
  }
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

app.get('/numbers/:numberId', async (req, res) => {
  const { numberId } = req.params;

  if (!['p', 'f', 'e', 'r'].includes(numberId)) {
    return res.status(400).json({ error: 'Invalid number ID. Use "p", "f", "e", or "r".' });
  }

  const prevState = [...numbersWindow];

  const fetchedNumbers = await fetchNumbers(numberId);
  fetchedNumbers.forEach(num => {
    if (!numbersWindow.includes(num)) {
      if (numbersWindow.length >= WINDOW_SIZE) {
        numbersWindow.shift();
      }
      numbersWindow.push(num);
    }
  });

  const currState = [...numbersWindow];
  const avg = calculateAverage(numbersWindow);

  res.json({
    windowPrevState: prevState,
    windowCurrState: currState,
    numbers: fetchedNumbers,
    avg: avg
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
