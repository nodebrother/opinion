require('dotenv').config();
const axios = require('axios');

const CONFIG = {
    baseURL: 'https://api.opinion.trade/v1',
    apiKey: process.env.API_KEY,
    endpoints: {
        positions: '/user/positions',
        trades: '/user/trades'
    }
};

const client = axios.create({
    baseURL: CONFIG.baseURL,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': CONFIG.apiKey
    }
});

async function main() {
    try {
        const [posRes, tradeRes] = await Promise.all([
            client.get(CONFIG.endpoints.positions),
            client.get(CONFIG.endpoints.trades)
        ]);

        const positions = posRes.data.data || posRes.data;
        const trades = tradeRes.data.data || tradeRes.data;

        console.log('--- POSITIONS ---');
        console.table(positions.map(p => ({
            Symbol: p.market || p.symbol,
            Side: p.side,
            Size: p.size || p.amount,
            Entry: p.entryPrice,
            PnL: p.unrealizedPnl || p.pnl
        })));

        console.log('\n--- TRADES ---');
        console.table(trades.map(t => ({
            Time: t.timestamp || t.createdAt,
            Symbol: t.market || t.symbol,
            Side: t.side,
            Price: t.price,
            Size: t.size || t.amount,
            Fee: t.fee
        })));

    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
    }
}

main();
