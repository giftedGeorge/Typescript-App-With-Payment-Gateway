import express, {Router} from 'express';
import middlewares from '../middlewares'
const paymentRouter:Router = express.Router();

import {paystackController} from '../controllers';

// Need to apply validation

paymentRouter.use(middlewares.validateAccessToken, middlewares.validateUserAuthenticated);

paymentRouter.post('/initialize', paystackController.initializePayment);
paymentRouter.get('/verify', paystackController.verifyPayment);

export default paymentRouter;