import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TableSortLabel,
    Typography,
    Box
} from '@mui/material';

interface CustomerApiResult {
    period: string;
    state: string;
    sector: string;
    customers: number;
    customers_units: string;
}

interface CustomerDataTableProps {
    data: CustomerApiResult[];
}

type Order = 'asc' | 'desc';

const CustomerDataTable: React.FC<CustomerDataTableProps> = ({ data }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState<keyof CustomerApiResult>('period');
    const [order, setOrder] = useState<Order>('desc');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (property: keyof CustomerApiResult) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedData = [...data].sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (order === 'desc') {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        } else {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
    });

    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Customer Data</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'period'}
                                    direction={orderBy === 'period' ? order : 'asc'}
                                    onClick={() => handleSort('period')}
                                >
                                    Period
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'state'}
                                    direction={orderBy === 'state' ? order : 'asc'}
                                    onClick={() => handleSort('state')}
                                >
                                    State
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'sector'}
                                    direction={orderBy === 'sector' ? order : 'asc'}
                                    onClick={() => handleSort('sector')}
                                >
                                    Sector
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'customers'}
                                    direction={orderBy === 'customers' ? order : 'asc'}
                                    onClick={() => handleSort('customers')}
                                >
                                    Customers
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Units</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.period}</TableCell>
                                <TableCell>{row.state}</TableCell>
                                <TableCell>{row.sector}</TableCell>
                                <TableCell>{row.customers?.toLocaleString()}</TableCell>
                                <TableCell>{row.customers_units}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
};

export default CustomerDataTable; 