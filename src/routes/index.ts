import express from 'express';
import transferRouter from './transfer';
import userRouter from './user';
import authRouter from './auth';
import paymentRouter from './payment';
import walletRouter from './wallet';

const router = express.Router();

router.use('/transfer', transferRouter);
router.use('/payment', paymentRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/wallet', walletRouter);

export default router;