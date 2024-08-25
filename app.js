import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Card, CardContent, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
    setError(null); // Clear error on new input
  };

  const handleSubmit = async () => {
    try {
      const isValidJSON = await isValidJson(userInput);
      if (!isValidJSON) {
        throw new Error('Invalid JSON format');
      }

      const apiUrl = 'YOUR_DEPLOYED_API_URL/bfhl'; // Replace with your deployed URL
      const responseData = await axios.post(apiUrl, JSON.parse(userInput));
      setResponse(responseData.data);
      setSelectedFilters([]); // Reset filters on submission
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilterChange = (event) => {
    setSelectedFilters(event.target.checked ? [...selectedFilters, event.target.value] : selectedFilters.filter((filter) => filter !== event.target.value));
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const filteredData = {
      numbers: selectedFilters.includes('Numbers') ? response.numbers : [],
      alphabets: selectedFilters.includes('Alphabets') ? response.alphabets : [],
      highest_lowercase_alphabet: response.highest_lowercase_alphabet
    };

    return (
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Filtered Response
          </Typography>
          {filteredData.numbers.length > 0 && (
            <Typography variant="body2" gutterBottom>
              Numbers: {filteredData.numbers.join(', ')}
            </Typography>
          )}
          {filteredData.alphabets.length > 0 && (
            <Typography variant="body2" gutterBottom>
              Alphabets: {filteredData.alphabets.join(', ')}
            </Typography>
          )}
          {filteredData.highest_lowercase_alphabet.length > 0 && (
            <Typography variant="body2" gutterBottom>
              Highest Lowercase Alphabet: {filteredData.highest_lowercase_alphabet[0]}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="md">
      <h1 className="text-center mt-3">API Data Processor</h1>
      {error && <Alert severity="error">{error}</Alert>}
      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <FormLabel component="legend">Enter JSON Data:</FormLabel>
        <FormGroup>
          <textarea
            className="form-control"
            rows={5}
            value={userInput}
            onChange={handleInputChange}
          />
        </FormGroup>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        Process Data
      </Button>
      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <FormLabel component="legend">Filters:</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={selectedFilters.includes('Numbers')} onChange={(event) => handleFilterChange({ target: { value: 'Numbers', checked: event.target.checked } })} />}
            label="Numbers"
          />
          <FormControlLabel
            control={<Checkbox checked={selectedFilters.includes('Alphabets')} onChange={(event) => handleFilterChange({ target: { value: 'Alphabets', checked: event.target.checked } })} />}
            label="Alphabets"
          />
        </FormGroup>
      </FormControl>
      {response && renderFilteredResponse()}
    </Container>
  );
};

export default App;