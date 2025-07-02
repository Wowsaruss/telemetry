import { useState, useCallback, useMemo } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CustomerDataTable from './CustomerDataTable';
import CustomerChart from './CustomerChart';
import CostAndUsageFilterForm from '../cost-and-usage/CostAndUsageFilterForm';

interface CustomerApiResult {
    period: string;
    state: string;
    sector: string;
    customers: number;
    customers_units: string;
}

interface CustomerDashboardProps {
    onSwitchToCostAndUsage: () => void;
}

function CustomerDashboard({ onSwitchToCostAndUsage }: CustomerDashboardProps) {
    const [state, setState] = useState('AZ');
    const [sector, setSector] = useState('RES');
    const [frequency, setFrequency] = useState('annual');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [length, setLength] = useState('60');
    const [data, setData] = useState<CustomerApiResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Memoize params
    const params = useMemo(() => ({ state, sector, frequency, start, end, length }), [state, sector, frequency, start, end, length]);

    // Memoized fetchData
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:4000/api/customers?' + new URLSearchParams(params as any)).then(r => r.json());
            const arr = Array.isArray(res) ? res : [res];
            setData(arr);
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch customer data');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [params]);

    // Memoize chart and table data
    const chartData = useMemo(() => data, [data]);
    const tableData = useMemo(() => data, [data]);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', pt: 4 }}>
            <Container maxWidth="lg" sx={{ py: 4, mx: 'auto', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Customer Dashboard</Typography>

                <Paper sx={{ p: 2, mb: 3, elevation: 2, borderRadius: 2 }}>
                    <Button
                        variant="contained"
                        onClick={onSwitchToCostAndUsage}
                        sx={{ mr: 2 }}
                    >
                        Switch to Cost and Usage Dashboard
                    </Button>
                </Paper>
                <>
                    <CostAndUsageFilterForm
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
                    {chartData.length > 0 && (
                        <Paper sx={{ p: 3, mb: 4, elevation: 3, borderRadius: 2 }}>
                            <CustomerChart data={chartData} />
                        </Paper>
                    )}
                    {tableData.length > 0 && (
                        <Paper sx={{ p: 3, mb: 4, elevation: 3, borderRadius: 2 }}>
                            <CustomerDataTable data={tableData} />
                        </Paper>
                    )}
                </>
            </Container>
        </Box>
    );
}

export default CustomerDashboard; 