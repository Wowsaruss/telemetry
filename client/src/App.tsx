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
import GridTopologyExplorer from './GridTopologyExplorer';
import { TableSortLabel, TablePagination } from '@mui/material';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

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
  const [showExplorer, setShowExplorer] = useState(false);
  const [tablePage, setTablePage] = useState(0);
  const [tableRowsPerPage, setTableRowsPerPage] = useState(10);
  const [tableOrderBy, setTableOrderBy] = useState<'period' | 'state' | 'sector' | 'price_cents_per_kwh' | 'sales_million_kwh'>('period');
  const [tableOrder, setTableOrder] = useState<'asc' | 'desc'>('asc');

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

  function sortRows<T>(rows: T[], orderBy: keyof T, order: 'asc' | 'desc') {
    return [...rows].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Telemetry Dashboard</Typography>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => setShowExplorer(v => !v)}>
        {showExplorer ? 'Back to Dashboard' : 'Grid Topology Explorer'}
      </Button>
      {showExplorer ? (
        <GridTopologyExplorer />
      ) : (
        <>
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
                <TableContainer>
                  <Table size="small" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sortDirection={tableOrderBy === 'period' ? tableOrder : false}>
                          <TableSortLabel
                            active={tableOrderBy === 'period'}
                            direction={tableOrderBy === 'period' ? tableOrder : 'asc'}
                            onClick={() => {
                              setTableOrderBy('period');
                              setTableOrder(tableOrder === 'asc' ? 'desc' : 'asc');
                            }}
                          >
                            Period
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={tableOrderBy === 'state' ? tableOrder : false}>
                          <TableSortLabel
                            active={tableOrderBy === 'state'}
                            direction={tableOrderBy === 'state' ? tableOrder : 'asc'}
                            onClick={() => {
                              setTableOrderBy('state');
                              setTableOrder(tableOrder === 'asc' ? 'desc' : 'asc');
                            }}
                          >
                            State
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={tableOrderBy === 'sector' ? tableOrder : false}>
                          <TableSortLabel
                            active={tableOrderBy === 'sector'}
                            direction={tableOrderBy === 'sector' ? tableOrder : 'asc'}
                            onClick={() => {
                              setTableOrderBy('sector');
                              setTableOrder(tableOrder === 'asc' ? 'desc' : 'asc');
                            }}
                          >
                            Sector
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={tableOrderBy === 'price_cents_per_kwh' ? tableOrder : false}>
                          <TableSortLabel
                            active={tableOrderBy === 'price_cents_per_kwh'}
                            direction={tableOrderBy === 'price_cents_per_kwh' ? tableOrder : 'asc'}
                            onClick={() => {
                              setTableOrderBy('price_cents_per_kwh');
                              setTableOrder(tableOrder === 'asc' ? 'desc' : 'asc');
                            }}
                          >
                            Price (¢/kWh)
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={tableOrderBy === 'sales_million_kwh' ? tableOrder : false}>
                          <TableSortLabel
                            active={tableOrderBy === 'sales_million_kwh'}
                            direction={tableOrderBy === 'sales_million_kwh' ? tableOrder : 'asc'}
                            onClick={() => {
                              setTableOrderBy('sales_million_kwh');
                              setTableOrder(tableOrder === 'asc' ? 'desc' : 'asc');
                            }}
                          >
                            Sales (M kWh)
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Price Units</TableCell>
                        <TableCell>Sales Units</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortRows(data, tableOrderBy, tableOrder)
                        .slice(tablePage * tableRowsPerPage, tablePage * tableRowsPerPage + tableRowsPerPage)
                        .map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{row.period}</TableCell>
                            <TableCell>{row.state}</TableCell>
                            <TableCell>{row.sector}</TableCell>
                            <TableCell>{row.price_cents_per_kwh}</TableCell>
                            <TableCell>{row.sales_million_kwh}</TableCell>
                            <TableCell>{row.price_units}</TableCell>
                            <TableCell>{row.sales_units}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={data.length}
                    page={tablePage}
                    onPageChange={(_, newPage) => setTablePage(newPage)}
                    rowsPerPage={tableRowsPerPage}
                    onRowsPerPageChange={e => {
                      setTableRowsPerPage(parseInt(e.target.value, 10));
                      setTablePage(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50]}
                  />
                </TableContainer>
              </Box>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
}

export default App;
