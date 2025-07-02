import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ApiResult } from './TelemetryDataTable';

interface TelemetryChartProps {
    data: ApiResult[];
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({ data }) => {
    if (!data.length) return null;
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Cost & Usage Over Time</Typography>
            <Paper sx={{ p: 2, bgcolor: 'black' }}>
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
            </Paper>
        </Box>
    );
};

export default TelemetryChart; 