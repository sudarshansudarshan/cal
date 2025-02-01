import express from 'express';
import { PrismaClient } from '@prisma/client';
import UserSessionHandling from './routes/UserSessionHandling';
import AssessmentGrading from './routes/AssessmentGrading';
import ProgressTracking from './routes/ProgressTracking';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Use CORS middleware first
app.use(cors({
    origin: [
        'http://localhost:4000',
        'http://192.168.1.46:4000',
        'http://157.20.214.128:8000',
        'vicharanashala.in'
    ],
    credentials: true
}));

// Then, use JSON parser
app.use(express.json());

// After setting up CORS, add your routes
app.use(UserSessionHandling);
app.use(AssessmentGrading);
app.use(ProgressTracking);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
