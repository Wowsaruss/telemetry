import React, { useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import GridTopologyExplorer from './GridTopologyExplorer';
import CustomerDataTable from './CustomerDataTable';
import CustomerChart from './CustomerChart';
import TelemetryFilterForm from './TelemetryFilterForm';

interface CustomerApiResult {
    period: string;
    state: string;
    sector: string;
    customers: number;
    customers_units: string;
}

interface CustomerDashboardProps {
    onSwitchToTelemetry: () => void;
}

function CustomerDashboard({ onSwitchToTelemetry }: CustomerDashboardProps) {
    const [state, setState] = useState('AZ');
    const [sector, setSector] = useState('RES');
    const [frequency, setFrequency] = useState('annual');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [length, setLength] = useState('60');
    const [data, setData] = useState<CustomerApiResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showExplorer, setShowExplorer] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError('');

        try {
            const params = { state, sector, frequency, start, end, length };
            const res = await axios.get<CustomerApiResult[]>('http://localhost:4000/api/customers', { params });
            // If backend returns a single object, wrap in array
            const arr = Array.isArray(res.data) ? res.data : [res.data];

            setData(arr);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Failed to fetch customer data');
            } else {
                setError('Failed to fetch customer data');
            }
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', pt: 4 }}>
            <Container maxWidth="lg" sx={{ py: 4, mx: 'auto', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Customer Dashboard</Typography>

                <Paper sx={{ p: 2, mb: 3, elevation: 2, borderRadius: 2 }}>
                    <Button
                        variant="contained"
                        onClick={onSwitchToTelemetry}
                        sx={{ mr: 2 }}
                    >
                        Switch to Telemetry Dashboard
                    </Button>
                </Paper>

                {showExplorer ? (
                    <GridTopologyExplorer />
                ) : (
                    <>
                        <TelemetryFilterForm
                            state={state}
                            setState={setState}
                            sector={sector}
                            setSector={setSector}
                            frequency={frequency}
                            setFrequency={setFrequency}
                            start={start}
                            setStart={setStart}
                            end={end}
                            setEnd={setEnd}
                            length={length}
                            setLength={setLength}
                            onFetchData={fetchData}
                            loading={loading}
                        />
                        {error && (
                            <Paper sx={{ p: 2, mb: 3, elevation: 2, borderRadius: 2, bgcolor: 'error.light' }}>
                                <Typography color="error">{error}</Typography>
                            </Paper>
                        )}
                        {data.length > 0 && (
                            <Paper sx={{ p: 3, mb: 4, elevation: 3, borderRadius: 2 }}>
                                <CustomerChart data={data} />
                            </Paper>
                        )}
                        {data.length > 0 && (
                            <Paper sx={{ p: 3, mb: 4, elevation: 3, borderRadius: 2 }}>
                                <CustomerDataTable data={data} />
                            </Paper>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
}

export default CustomerDashboard; 