import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

interface EiaRetailSalesResult {
    period: string;
    stateid: string;
    stateDescription: string;
    sectorid: string;
    sectorName: string;
    price: string;
    sales: string;
    'price-units': string;
    'sales-units': string;
}

app.get('/api/telemetry', async (req: Request, res: Response) => {
    try {
        const apiKey = process.env.EIA_API_KEY;
        if (!apiKey) {
            res.status(500).json({ error: 'EIA API key not set in environment.' });
            return;
        }
        // Get query params or set defaults
        const state = (req.query.state || 'AZ').toString().toUpperCase(); // Default: Arizona
        const sector = (req.query.sector || 'RES').toString().toUpperCase(); // Default: Residential
        const start = req.query.start ? req.query.start.toString() : undefined;
        const end = req.query.end ? req.query.end.toString() : undefined;
        const length = req.query.length ? req.query.length.toString() : '5000'; // Default: 5000

        let url = `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${apiKey}&frequency=monthly&data[0]=price&data[1]=sales&facets[stateid][]=${state}&facets[sectorid][]=${sector}`;
        if (start) url += `&start=${start}`;
        if (end) url += `&end=${end}`;
        url += `&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=${length}`;

        const response = await axios.get(url);

        let dataArr: EiaRetailSalesResult[] = response.data.response.data;
        if (!dataArr || dataArr.length === 0) {
            res.status(404).json({ error: 'No data returned from EIA for the given filters.' });
            return;
        }

        // If period is specified, filter for that period
        if (req.query.period) {
            dataArr = dataArr.filter((item: EiaRetailSalesResult) => item.period === req.query.period);
            if (dataArr.length === 0) {
                res.status(404).json({ error: 'No data for the specified period.' });
                return;
            }
        }
        // Return all results in the filtered array
        const formatted = dataArr.map(item => ({
            period: item.period,
            state: item.stateDescription,
            sector: item.sectorName,
            price_cents_per_kwh: parseFloat(item.price),
            sales_million_kwh: parseFloat(item.sales),
            price_units: item['price-units'],
            sales_units: item['sales-units'],
        }));
        res.json(formatted);
    } catch (error) {
        console.error('Error fetching EIA data:', error);
        res.status(500).json({ error: 'Failed to fetch data from EIA.' });
    }
});

app.listen(PORT, () => {
    console.log('Telemetry API server running on http://localhost:' + PORT);
});
