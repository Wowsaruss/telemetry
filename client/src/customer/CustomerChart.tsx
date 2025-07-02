import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CustomerApiResult {
    period: string;
    state: string;
    sector: string;
    customers: number;
    customers_units: string;
}

interface CustomerChartProps {
    data: CustomerApiResult[];
}

const CustomerChart: React.FC<CustomerChartProps> = ({ data }) => {
    if (!data.length) return null;
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Customer Count Over Time</Typography>
            <Paper sx={{ p: 2, bgcolor: 'black' }}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.slice().reverse()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis label={{ value: 'Customers', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="customers" stroke="#ff6b35" name="Customers" />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default CustomerChart; 