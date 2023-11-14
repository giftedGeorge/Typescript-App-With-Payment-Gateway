import express from 'express';
const walletRouter = express.Router();
import {walletController} from '../controllers';
import middleware from '../middlewares';
import { ResolveAccountRequestModel} from '../requestModels';


/**
 * @swagger
 * components:
 *   schemas:
 *     ResolveAccountNumberRequestModel:
 *       type: object
 *       properties:
 *         accountNumber:
 *           type: string
 *         accountName:
 *           type: string
 * 
 *     OtherResponseModel:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 * 
 * 
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 */


walletRouter.use(middleware.validateAccessToken)

/**
 * @swagger
 * /api/wallet/create-wallet:
 *   post:
 *     summary: create a wallet
 *     description: In order to perform transactions, you'll need to create a wallet with a valid account number.
 *     tags:
 *       - Wallets
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResolveAccountNumberRequestModel'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "_id": "654d9a0a52fb8e0e0972496d",
 *                 "owner": "654d9a0a52fb8e0e0972496d",
 *                 "accountNumber": "0193330044",
 *                 "bankCode": "0193330044",
 *                 "currency": "NGN",
 *                 "balance": 0,
 *               }
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtherResponseModel'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtherResponseModel'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtherResponseModel'
 */
walletRouter.post('/create-wallet', middleware.validateRequest(ResolveAccountRequestModel), walletController.createWallet);

export default walletRouter;