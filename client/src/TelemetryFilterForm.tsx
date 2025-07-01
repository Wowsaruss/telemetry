import React from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { stateOptions, sectorOptions } from './options';

interface TelemetryFilterFormProps {
    state: string;
    setState: (state: string) => void;
    sector: string;
    setSector: (sector: string) => void;
    start: string;
    setStart: (start: string) => void;
    end: string;
    setEnd: (end: string) => void;
    length: string;
    setLength: (length: string) => void;
    onFetchData: () => void;
    loading: boolean;
}

const TelemetryFilterForm: React.FC<TelemetryFilterFormProps> = ({
    state,
    setState,
    sector,
    setSector,
    start,
    setStart,
    end,
    setEnd,
    length,
    setLength,
    onFetchData,
    loading
}) => {
    return (
        <Paper sx={{ p: 3, mb: 4, elevation: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                        select
                        label="State"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        fullWidth
                    >
                        {stateOptions.map(opt => (
                            <MenuItem key={opt.code} value={opt.code}>
                                {opt.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                        select
                        label="Sector"
                        value={sector}
                        onChange={e => setSector(e.target.value)}
                        fullWidth
                    >
                        {sectorOptions.map(opt => (
                            <MenuItem key={opt.code} value={opt.code}>
                                {opt.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                        label="Start"
                        value={start}
                        onChange={e => setStart(e.target.value)}
                        fullWidth
                        placeholder="YYYY-MM"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                        label="End"
                        value={end}
                        onChange={e => setEnd(e.target.value)}
                        fullWidth
                        placeholder="YYYY-MM"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                        label="Length"
                        value={length}
                        onChange={e => setLength(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                    <Button
                        variant="contained"
                        onClick={onFetchData}
                        fullWidth
                        disabled={loading}
                    >
                        Fetch Data
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default TelemetryFilterForm; 