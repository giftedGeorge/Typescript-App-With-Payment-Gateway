import express from 'express';
import paymentRouter from './payment';
import userRouter from './user';
import authRouter from './auth';

const router = express.Router();

router.use('/payments', paymentRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);


export default router;