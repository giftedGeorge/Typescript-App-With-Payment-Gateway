import express, {Router} from 'express';
import middlewares from '../middlewares'
const transferRouter:Router = express.Router();
import 'swagger-Jsdoc';
import {paystackController} from '../controllers';
import * as requestModels from '../requestModels';



/**
 * @swagger
 * components:
 *   schemas:
 *     ListBanksResponse:
 *       description: object whose data property contains an array of bank objects.
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           description: The status of the request
 *         message:
 *           type: string
 *           description: message specifying that the banks have been received
 *         data:
 *           type: object
 *           description: an array of bank objects.
 * 
 *     GetRecipientResponse:
 *       description: object containing details of the recipient with the passed recipient code.
 *       type: object
 *       properties:
 *         domain:
 *           type: string
 *         type:
 *           type: string
 *         currency:
 *           type: string
 *           description: the currency of the recipient's account.
 *         name:
 *           type: string
 *           description: the recipient's name
 *         details:
 *           type: object
 *           description: contains some details of the recipient.
 * 
 *     InitiateTransferRequestModel:
 *       type: object
 *       properties:
 *         source:
 *           type: string
 *         reason:
 *           type: string
 *         amount:
 *           type: number
 *         recipientCode:
 *           type: string
 *         recipientAccountNo:
 *           type: string
 *         recipientBankName:
 *           type: string
 *         recipientaccountName:
 *           type: string
 *         recipientWalletId:
 *           type: string
 * 
 *     FinalizeTransferRequestModel:
 *       type: object
 *       properties:
 *         transferCode:
 *           type: string
 *           description: the transferCode returned from the "initialize transfer" endpoint.
 *         otp:
 *           type: string
 *           description: a one time password that will be sent to the phone number associated with the third party payment gateway account
 * 
 *     CreateTransferRecipientRequestModel:
 *       type: object
 *       properties:
 *         recipientType:
 *           type: string
 *         recipientName:
 *           type: string
 *         recipientAccountNumber:
 *           type: string
 *         recipientBankCode:
 *           type: string
 *         currency:
 *           type: string
 *         description:
 *           type: string
 *         recipientEmail:
 *           type: string
 *         recipientWalletId:
 *           type: string
 * 
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

/**
 * @swagger
 * /api/transfer/paystack/webhook/url:
 *   post:
 *     summary: webhook to verify transfers
 *     tags:
 *       - Transfers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             {
 *               "event": "transfer.success",
 *               "data": {
 *                 "amount": 30000,
 *                 "currency": "NGN",
 *                 "domain": "test",
 *                 "failures": null,
 *                 "id": 37272792,
 *                 "integration": {
 *                   "id": 463433,
 *                   "is_live": true,
 *                   "business_name": "Boom Boom Industries NG"
 *                 },
 *                 "reason": "Have fun...",
 *                 "reference": "1jhbs3ozmen0k7y5efmw",
 *                 "source": "balance",
 *                 "source_details": null,
 *                 "status": "success",
 *                 "titan_code": null,
 *                 "transfer_code": "TRF_wpl1dem4967avzm",
 *                 "transferred_at": null,
 *                 "recipient": {
 *                   "active": true,
 *                   "currency": "NGN",
 *                   "description": "",
 *                   "domain": "test",
 *                   "email": null,
 *                   "id": 8690817,
 *                   "integration": 463433,
 *                   "metadata": null,
 *                   "name": "Jack Sparrow",
 *                   "recipient_code": "RCP_a8wkxiychzdzfgs",
 *                   "type": "nuban",
 *                   "is_deleted": false,
 *                   "details": {
 *                     "account_number": "0000000000",
 *                     "account_name": null,
 *                     "bank_code": "011",
 *                     "bank_name": "First Bank of Nigeria"
 *                   },
 *                   "created_at": "2020-09-03T12:11:25.000Z",
 *                   "updated_at": "2020-09-03T12:11:25.000Z"
 *                 },
 *                 "session": {
 *                   "provider": null,
 *                     "id": null
 *                 },
 *                 "created_at": "2020-10-26T12:28:57.000Z",
 *                 "updated_at": "2020-10-26T12:28:57.000Z"
 *               }
 *             }
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtherResponseModel'
 */
transferRouter.post("/paystack/webhook/url", paystackController.getTransferUpdateWebhook);

transferRouter.use(middlewares.validateAccessToken, middlewares.validateUserAuthenticated);


/**
 * @swagger
 * /api/transfer/list-banks:
 *   get:
 *     summary: get a list of all banks
 *     description: You'll need a list of available banks and their details, such as bank code, from which the transfer recipient's bank and bank code can be obtained. 
 *     tags:
 *       - Transfers
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListBanksResponse'
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
transferRouter.get('/list-banks', paystackController.listBanks);


/**
 * @swagger
 * /api/transfer/resolve-account-number:
 *   post:
 *     summary: resolve an account number
 *     description: get the details of a bank account number to verify the recipient's bank data. 
 *     tags:
 *       - Transfers
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
 *                 "accountNumber": "0193330044",
 *                 "accountName": "john doe",
 *                 "bankId": 1
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
transferRouter.post('/resolve-account-number', middlewares.validateRequest(requestModels.ResolveAccountRequestModel), paystackController.resolveAccountNumber);


/**
 * @swagger
 * /api/transfer/create-transfer-recipient:
 *   post:
 *     summary: create a transfer recipient
 *     description: You'll need to create the recipient for which the transfer in intended by passing in the required values.
 *     tags:
 *       - Transfers
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransferRecipientRequestModel'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Transfer Recipient Created successfully",
 *                 "data": {
 *                    "active": true,
 *                    "createdAt": "2023-11-10T03:03:16.000Z",
 *                    "currency": "NGN",
 *                    "description": "Trial run",
 *                    "domain": "test",
 *                    "email": "example@gmail.com",
 *                    "id": 64537609,
 *                    "integration": 1099278,
 *                    "metadata": {
 *                       "email": "example@gmail.com",
 *                       "name": "john doe",
 *                       "walletId": "654d9a0a52fb8e0e0972496d"
 *                    },
 *                    "name": "john doe",
 *                    "recipientCode": "RCP_16gfpqadsojj5ez",
 *                    "type": "nuban",
 *                    "updatedAt": "2023-11-13T01:47:40.000Z",
 *                    "isDeleted": false,
 *                    "details": {
 *                      "authorization_code": null,
 *                      "account_number": "0193330044",
 *                      "account_name": "joh doe",
 *                      "bank_code": "044",
 *                      "bank_name": "Access Bank"
 *                    }
 *                 }
 *              }
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
transferRouter.post('/create-transfer-recipient', middlewares.validateRequest(requestModels.CreateTransferRecipientRequestModel), paystackController.createTransferRecipient);


/**
 * @swagger
 * /api/transfer/get-recipient/{recipientCode}:
 *   get:
 *     summary: retrieve an existing recipient using a recipient code
 *     description: get the details of the transfer recipient, from which some vital information required to populate the "/initiate-transfer" route can be obtained. 
 *     tags:
 *       - Transfers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipientCode
 *         description: the recipientCode of the trsnsfer recipient
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetRecipientResponse'
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
transferRouter.get('/get-recipient/:recipientCode', paystackController.getTransferRecipient);


/**
 * @swagger
 * /api/transfer/initiate:
 *   post:
 *     summary: initiate a transfer
 *     description: After creating a transfer recipient, You'll need to initialize the transfer by passing in the required values.
 *     tags:
 *       - Transfers
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InitiateTransferRequestModel'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "transfersessionid": [],
 *                 "domain": "test",
 *                 "amount": 10000,
 *                 "currency": "NGN",
 *                 "reference": "4a93952b-3914-4709-b139-c850b6480182",
 *                 "source": "balance",
 *                 "sourceDetails": null,
 *                 "reason": "P2P trial",
 *                 "status": "otp",
 *                 "failures": null,
 *                 "transferCode": "TRF_mjed9ot66w6gubwa",
 *                 "titanCode": null,
 *                 "transferredAt": null,
 *                 "id": 391167982,
 *                 "integration": 1099278,
 *                 "request": 417608099,
 *                 "recipient": 64537609,
 *                 "createdAt": "2023-11-13T01:55:45.000Z",
 *                 "updatedAt": "2023-11-13T01:55:45.000Z"
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
transferRouter.post('/initiate', middlewares.validateRequest(requestModels.InitiateTransferRequestModel),  paystackController.initiateTransfer);


/**
 * @swagger
 * /api/transfer/finalize:
 *   post:
 *     summary: finalize a transfer
 *     description: After initializing a transfer, You'll need to finalize the transfer by passing in the required values.
 *     tags:
 *       - Transfers
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinalizeTransferRequestModel'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "domain": "test",
 *                 "amount": 10000,
 *                 "currency": "NGN",
 *                 "reference": "4a93952b-3914-4709-b139-c850b6480182",
 *                 "source": "balance",
 *                 "sourceDetails": null,
 *                 "reason": "P2P trial",
 *                 "status": "otp",
 *                 "failures": null,
 *                 "transferCode": "TRF_mjed9ot66w6gubwa",
 *                 "titanCode": null,
 *                 "transferredAt": null,
 *                 "id": 391167982,
 *                 "integration": 1099278,
 *                 "request": 417608099,
 *                 "recipient": 64537609,
 *                 "createdAt": "2023-11-13T01:55:45.000Z",
 *                 "updatedAt": "2023-11-13T01:55:45.000Z"
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
transferRouter.post('/finalize', middlewares.validateRequest(requestModels.FinalizeTransferRequestModel),  paystackController.finalizeTransfer);


/**
 * @swagger
 * /api/transfer/verify/{reference}:
 *   get:
 *     summary: verify the status of a transfer
 *     description: get the details of a transfer, including the status, to verify that the transaction was successful. 
 *     tags:
 *       - Transfers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         description: reference of the transaction
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
 *                 "message": "Transfer verified",
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
transferRouter.get('/verify/:reference', paystackController.verifyTransfer);


/**
 * @swagger
 * /api/transfer/list-transfers:
 *   get:
 *     summary: list user's transfers
 *     description: get a list of all transfer transactions made by a user
 *     tags:
 *       - Transfers
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "transfers": [
 *                    {
 *                      "_id": "65518221005015c6aba9510b",
 *                      "owner": "652e9d331bebbbbf39e16b05",
 *                      "type": 2,
 *                      "currency": "NGN",
 *                      "amount": 10000,
 *                      "recipientAccountNo": "0193330044",
 *                      "recipientBankName": "VFD Bank",
 *                      "recipientWalletId": "654d9a0a52fb8e0e0972496d",
 *                      "code": "TRF_mjed9ot6sdbhnbwa",
 *                      "codeType": 2,
 *                      "transactionReference": "4a93952b-3914-4709-b139-c850b6480182",
 *                      "createdAt": "2023-11-13T01:55:45.710Z",
 *                      "updatedAt": "2023-11-13T02:32:18.240Z",
 *                      "__v": 0,
 *                      "status": "success"
 *                    },
 *                    {
 *                      "_id": "55678221005015c6aba9510b",
 *                      "owner": "652e9d331bebbbbf39e16b05",
 *                      "type": 2,
 *                      "currency": "NGN",
 *                      "amount": 10000,
 *                      "recipientAccountNo": "0193330044",
 *                      "recipientBankName": "VFD Bank",
 *                      "recipientWalletId": "654d9a0a52fb8e0e0972496d",
 *                      "code": "TRF_mjed9ot6sdbhnbwa",
 *                      "codeType": 2,
 *                      "transactionReference": "4a93952b-3914-4709-b139-c850b6480182",
 *                      "createdAt": "2023-11-13T01:55:45.710Z",
 *                      "updatedAt": "2023-11-13T02:32:18.240Z",
 *                      "__v": 0,
 *                      "status": "success"
 *                    }
 *                  ]
 *                }
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
transferRouter.get('/list-transfers', paystackController.listTransfers);


/**
 * @swagger
 * /api/transfer/get-transfer/{transactionId}:
 *   get:
 *     summary: get transfer
 *     description: get a specific transfer transactions made by a user, using the transaction id.
 *     tags:
 *       - Transfers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         description: ID of the transaction
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
 *                 "_id": "65518221005015c6aba9510b",
 *                 "owner": "652e9d331bebbbbf39e16b05",
 *                 "type": 2,
 *                 "currency": "NGN",
 *                 "amount": 10000,
 *                 "recipientAccountNo": "0193330044",
 *                 "recipientBankName": "VFD Bank",
 *                 "recipientWalletId": "654d9a0a52fb8e0e0972496d",
 *                 "code": "TRF_mjed9ot6sdbhnbwa",
 *                 "codeType": 2,
 *                 "transactionReference": "4a93952b-3914-4709-b139-c850b6480182",
 *                 "createdAt": "2023-11-13T01:55:45.710Z",
 *                 "updatedAt": "2023-11-13T02:32:18.240Z",
 *                 "__v": 0,
 *                 "status": "success"
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
transferRouter.get('/get-transfer/:transactionId', paystackController.getTransferByTransactionId);


export default transferRouter;