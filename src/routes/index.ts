import express from 'express';
import paymentRouter from './payment';

const router = express.Router();

router.use('/payments', paymentRouter);


export default router;