import { useState, useCallback, useMemo } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CostAndUsageDataTable from './CostAndUsageDataTable';
import CostAndUsageChart from './CostAndUsageChart';
import CostAndUsageFilterForm from './CostAndUsageFilterForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResult {
    period: string;
    state: string;
    sector: string;
    price_cents_per_kwh: number;
    sales_million_kwh: number;
    price_units: string;
    sales_units: string;
}

interface CostAndUsageDashboardProps {
    onSwitchToCustomerDashboard: () => void;
}

function CostAndUsageDashboard({ onSwitchToCustomerDashboard }: CostAndUsageDashboardProps) {
    const [state, setState] = useState('AZ');
    const [sector, setSector] = useState('RES');
    const [frequency, setFrequency] = useState('monthly');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [length, setLength] = useState('60');
    const [data, setData] = useState<ApiResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Memoize params to avoid unnecessary fetches
    const params = useMemo(() => ({ state, sector, frequency, start, end, length }), [state, sector, frequency, start, end, length]);

    // Memoized fetchData
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/cost-and-usage?` + new URLSearchParams(params as any)).then(r => r.json());
            const arr = Array.isArray(res) ? res : [res];
            setData(arr);
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch cost and usage data');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [params]);

    // Memoize chart and table data (could add more processing here if needed)
    const chartData = useMemo(() => data, [data]);
    const tableData = useMemo(() => data, [data]);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', pt: 4 }}>
            <Container maxWidth="lg" sx={{ py: 4, mx: 'auto', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Cost and Usage Dashboard</Typography>
                <Paper sx={{ p: 2, mb: 3, elevation: 2, borderRadius: 2 }}>
                    <Button
                        variant="contained"
                        onClick={onSwitchToCustomerDashboard}
                        sx={{ mr: 2 }}
                    >
                        Switch to Customer Dashboard
                    </Button>
                </Paper>
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
                        <CostAndUsageChart data={chartData} />
                    </Paper>
                )}
                {tableData.length > 0 && (
                    <Paper sx={{ p: 3, mb: 4, elevation: 3, borderRadius: 2 }}>
                        <CostAndUsageDataTable data={tableData} />
                    </Paper>
                )}
            </Container>
        </Box>
    );
}

export default CostAndUsageDashboard; 