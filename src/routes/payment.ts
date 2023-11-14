import express, {Router} from 'express';
import middlewares from '../middlewares'
const paymentRouter:Router = express.Router();
import {paystackController} from '../controllers';
import * as requestModels from '../requestModels';
import 'swagger-Jsdoc';


/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCustomerResponse:
 *       description: object that contains the details of the created customer.
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The customer's email
 *         customerCode:
 *           type: string
 *           description: A unique code assigned to the new customer.
 *         id:
 *           type: number
 *           description: The id of the new customer.
 * 
 *     InitializePaymentRequestModel:
 *       description: object that contains some details of the intended payment.
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The customer's email
 *         amount:
 *           type: number
 *           description: The payment amount in Naira.
 *         callbackUrl:
 *           type: string
 *           description: a callbackUrl to test.
 *         name:
 *           type: string
 *           description: The name of the new customer.
 * 
 *     OtherResponseModel:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string 
 */


/**
 * @swagger
 * /api/payment/verify:
 *   get:
 *     summary: verify the status of a payment
 *     description: After initializing a payment, the status of the transaction will be verified here 
 *     tags:
 *       - Transfer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reference
 *         description: the reference used to initiate the transaction
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Payment verified",
 *                 "data": {
 *                 "_id": "65518221005015c6aba9510b",
 *                 "owner": "652e9d331bebbbbf39e16b05",
 *                 "type": 2,
 *                 "currency": "NGN",
 *                 "amount": 10000,
 *                 "recipientAccountNo": "0193330044",
 *                 "recipientBankName": "VFD Bank",
 *                 "recipientWalletId": "654d9a0a52fb8e0e0972496d",
 *                 "code": "TRF_mjed9otsdhbnubwa",
 *                 "codeType": 2,
 *                 "transactionReference": "4a93952b-3914-4709-b139-c850b6480182",
 *                 "createdAt": "2023-11-13T01:55:45.710Z",
 *                 "updatedAt": "2023-11-13T02:32:18.240Z",
 *                 "__v": 0,
 *                 "status": "success"
 *                 }
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
 *       404:
 *         description: Resource not found
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
paymentRouter.get('/verify', paystackController.verifyPayment);

paymentRouter.use(middlewares.validateAccessToken, middlewares.validateUserAuthenticated);


/**
 * @swagger
 * /api/transfer/get-customer-code:
 *   get:
 *     summary: create a new customer
 *     description: Create a new customer and get a a unique customer code that will be used to identify the customer.
 *     tags:
 *       - Payments
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCustomerResponse'
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
 *       404:
 *         description: Resource not found
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
paymentRouter.get('/get-customer-code', paystackController.createCustomer);


/**
 * @swagger
 * /api/payment/initialize:
 *   post:
 *     summary: initialize a payment.
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InitializePaymentRequestModel'
 *     responses:
 *       200:
 *         description: Successful response
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
 *       404:
 *         description: Resource not found
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
paymentRouter.post('/initialize', middlewares.validateRequest(requestModels.InitializePaymentRequestModel),  paystackController.initializePayment);

export default paymentRouter;
