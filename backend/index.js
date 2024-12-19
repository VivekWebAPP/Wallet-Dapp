import express from 'express';
import ConnectToBackend from './db.js';
import authRoute from './routes/auth.js';
import walletRoute from './routes/wallet.js';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
const port = process.env.PORT;
const assiginedOrigin = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'https://wallet-dapp-p0r3.onrender.com',
    'https://wallet-dapp-jet.vercel.app/',
]


ConnectToBackend();

app.use(express.json());
app.use(cors({
    origin: assiginedOrigin, // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // If your requests include credentials like cookies
}));
app.use('/auth', authRoute);
app.use('/wallet', walletRoute);


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});