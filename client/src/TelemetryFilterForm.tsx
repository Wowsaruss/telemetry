import React from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { stateOptions, sectorOptions, frequencyOptions } from './options';
import { Typography } from '@mui/material';

interface TelemetryFilterFormProps {
    state: string;
    setState: (state: string) => void;
    sector: string;
    setSector: (sector: string) => void;
    frequency: string;
    setFrequency: (frequency: string) => void;
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
    frequency,
    setFrequency,
    start,
    setStart,
    end,
    setEnd,
    length,
    setLength,
    onFetchData,
    loading
}) => {
    // Get placeholder and validation pattern based on frequency
    const getDateConfig = (freq: string) => {
        switch (freq) {
            case 'annual':
                return { placeholder: 'YYYY', pattern: '^\\d{4}$', example: '2025' };
            case 'monthly':
            default:
                return { placeholder: 'YYYY-MM', pattern: '^\\d{4}-\\d{2}$', example: '2025-01' };
        }
    };

    const dateConfig = getDateConfig(frequency);

    // Handle frequency change and update date formats if needed
    const handleFrequencyChange = (newFrequency: string) => {
        setFrequency(newFrequency);

        // Clear start and end fields when frequency changes
        setStart('');
        setEnd('');
    };

    return (
        <Paper sx={{ p: 3, mb: 4, elevation: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Filter Price & Sales Data
            </Typography>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
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
                        select
                        label="Frequency"
                        value={frequency}
                        onChange={e => handleFrequencyChange(e.target.value)}
                        fullWidth
                    >
                        {frequencyOptions.map(opt => (
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
                        placeholder={dateConfig.placeholder}
                        inputProps={{
                            pattern: dateConfig.pattern,
                            title: `Format: ${dateConfig.example}`
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                    <TextField
                        label="End"
                        value={end}
                        onChange={e => setEnd(e.target.value)}
                        fullWidth
                        placeholder={dateConfig.placeholder}
                        inputProps={{
                            pattern: dateConfig.pattern,
                            title: `Format: ${dateConfig.example}`
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 1 }}>
                    <TextField
                        label="Length"
                        value={length}
                        onChange={e => setLength(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 1 }}>
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
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Date format: {dateConfig.example}
            </Typography>
        </Paper>
    );
};

export default TelemetryFilterForm; 