import React, { useState } from 'react';
import { TableSortLabel, TablePagination, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Box } from '@mui/material';

export interface ApiResult {
    period: string;
    state: string;
    sector: string;
    price_cents_per_kwh: number;
    sales_million_kwh: number;
    price_units: string;
    sales_units: string;
}

interface CostAndUsageDataTableProps {
    data: ApiResult[];
}

const CostAndUsageDataTable: React.FC<CostAndUsageDataTableProps> = ({ data }) => {
    const [tablePage, setTablePage] = useState(0);
    const [tableRowsPerPage, setTableRowsPerPage] = useState(10);
    const [tableOrderBy, setTableOrderBy] = useState<'period' | 'state' | 'sector' | 'price_cents_per_kwh' | 'sales_million_kwh'>('period');
    const [tableOrder, setTableOrder] = useState<'asc' | 'desc'>('asc');

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

    if (!data.length) return null;

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Cost & Usage Data</Typography>
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
        </Box>
    );
};

export default CostAndUsageDataTable; 