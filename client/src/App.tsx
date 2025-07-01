import React, { useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { stateOptions, sectorOptions } from './options';

interface ApiResult {
  period: string;
  state: string;
  sector: string;
  price_cents_per_kwh: number;
  sales_million_kwh: number;
  price_units: string;
  sales_units: string;
}

function App() {
  const [state, setState] = useState('AZ');
  const [sector, setSector] = useState('RES');
  const [start, setStart] = useState('2015-01');
  const [end, setEnd] = useState('2020-01');
  const [length, setLength] = useState('60');
  const [data, setData] = useState<ApiResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = { state, sector, start, end, length };
      const res = await axios.get<ApiResult[]>('http://localhost:4000/api/telemetry', { params });
      // If backend returns a single object, wrap in array
      const arr = Array.isArray(res.data) ? res.data : [res.data];

      setData(arr);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      } else {
        setError('Failed to fetch data');
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Telemetry Dashboard</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField select label="State" value={state} onChange={e => setState(e.target.value)} fullWidth>
              {stateOptions.map(opt => <MenuItem key={opt.code} value={opt.code}>{opt.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField select label="Sector" value={sector} onChange={e => setSector(e.target.value)} fullWidth>
              {sectorOptions.map(opt => <MenuItem key={opt.code} value={opt.code}>{opt.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField label="Start" value={start} onChange={e => setStart(e.target.value)} fullWidth placeholder="YYYY-MM" />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField label="End" value={end} onChange={e => setEnd(e.target.value)} fullWidth placeholder="YYYY-MM" />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField label="Length" value={length} onChange={e => setLength(e.target.value)} fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button variant="contained" onClick={fetchData} fullWidth disabled={loading}>Fetch Data</Button>
          </Grid>
        </Grid>
      </Paper>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {data.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Price & Sales Over Time</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.slice().reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" label={{ value: 'Price (¢/kWh)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Sales (M kWh)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="price_cents_per_kwh" stroke="#1976d2" name="Price (¢/kWh)" />
              <Line yAxisId="right" type="monotone" dataKey="sales_million_kwh" stroke="#2e7d32" name="Sales (M kWh)" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
      {data.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Data Table</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>State</th>
                  <th>Sector</th>
                  <th>Price (¢/kWh)</th>
                  <th>Sales (M kWh)</th>
                  <th>Price Units</th>
                  <th>Sales Units</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.period}</td>
                    <td>{row.state}</td>
                    <td>{row.sector}</td>
                    <td>{row.price_cents_per_kwh}</td>
                    <td>{row.sales_million_kwh}</td>
                    <td>{row.price_units}</td>
                    <td>{row.sales_units}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default App;
