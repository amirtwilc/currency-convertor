import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, MenuItem, Typography, Box } from "@mui/material";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);  
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [value, setValue] = useState('');
  const [convertedValue, setConvertedValue] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = 'cb70df96b46b2769971cde4e';

  useEffect(() => {
    //fetch available currencies when component loads
    const fetchCurrencies = async() => {
        try {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/codes`);
            const data = await response.json();
            if (data.result === 'success') {
                setCurrencies(data.supported_codes);
            } else {
                throw new Error('Failed to fetch currencies');
            }
        } catch (error) {
            setError('Error fetching currencies. Please try again.');
        }
    };
    fetchCurrencies();
  }, []);

  const handleConvert = async () => {
    setError('');
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`);
        const data = await response.json();
        const rate = data.conversion_rates[toCurrency];
        setConvertedValue(rate * value);
    } catch {
        setError("Failed to fetch exchange rate. Please try again.");
    }
  };

const handleSwitch = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedValue(null); //reset
}

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw"}}>
        <Container maxWidth="sm" sx={{ textAlign: "center", boxShadow: 3, p: 4, borderRadius: 2}}>
            <Typography variant="h4" gutterBottom>
                Currency Converter
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 2}}>
                <TextField 
                    select 
                    label="From"
                    value={fromCurrency} 
                    onChange={(e) => setFromCurrency(e.target.value)} 
                    fullWidth
                >
                    {currencies.map(([code, name]) => (
                        <MenuItem key={code} value={code}>
                            {`${code} - ${name}`}
                        </MenuItem>
                    ))}
                </TextField>

                <Button 
                    variant="outlined"
                    onClick={handleSwitch}
                >
                    ⇄
                </Button>
                
                <TextField 
                    select 
                    label="To"
                    value={toCurrency} 
                    onChange={(e) => setToCurrency(e.target.value)}  
                    fullWidth
                >
                    {currencies.map(([code, name]) => (
                        <MenuItem key={code} value={code}>
                            {`${code} - ${name}`}
                        </MenuItem>
                    ))}
                </TextField>

            </Box>


            <TextField
                    type="number"
                    label="Amount"
                    variant="outlined"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    fullWidth
                    sx={{mb: 2}}
            />

            <Button variant="contained" color="primary" onClick={handleConvert} fullWidth>
                Convert
            </Button>

            {/* RESULT */}
            {convertedValue !== null && (
                <Typography variant="h6" sx={{ mt: 2 }}>
                Converted Value: {convertedValue.toLocaleString()} {toCurrency}
                </Typography>
            )}

            {/* ERROR MESSAGE */}
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                {error}
                </Typography>
            )}
        </Container>
    </Box>
  );
};

export default CurrencyConverter;
