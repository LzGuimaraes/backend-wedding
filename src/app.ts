import express, { Request, Response } from 'express';
import cors from 'cors';
import guestRoutes from './routes/guestRoutes';
import donationRoutes from './routes/donationRoutes';
import giftRoutes from './routes/giftRoutes';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas da API
app.use('/api/guests', guestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/gifts', giftRoutes);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Wedding API is running!' });
});

app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error(err.stack); 
    res.status(500).send('Something broke!'); 
});


export default app;