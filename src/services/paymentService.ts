import {paystackApi}  from "../apis";
import { BadRequestError, ResourceNotFoundError, InternalServerError} from "../errors";
import { Request } from "express";
import models from "../models";
import { TransactionCodeType, TransactionType } from "../enums";
import logger from "../logger";
import { stringUtil } from "../utils";
import { walletRepository, transactionRepository, userRepository } from "../repositories";
import crypto from 'crypto';
const secret = process.env.PAYSTACK_SECRET_KEY!;


export const createCustomer = async (req:Request) => {
    const userWallet = await walletRepository.getWalletByUserId(req.user?.id!);

    if (!userWallet) {
        throw new ResourceNotFoundError('User wallet not found');
    }

    const customerDetails: paystackApi.CreateCustomerArgs = {
        email: req.user?.email!,
        first_name: req.user?.firstName!,
        last_name: req.user?.lastName!,
        phone: req.user?.phoneNumber!
    }

    const data = await paystackApi.paystackApiInstance.createCustomer(customerDetails);

    if(!data || data.customerCode === null){
        throw new InternalServerError('A problem occurred while accessing the requested resource. Please try again!');
    }

    userWallet.customerCode = data.customerCode;
    userWallet.save();

    logger.info(`customerCode was updated for user with id: ${req.user?.id}`)

    return data;
};

export const initializePayment = async (req: Request) => {
    const { amount, email, callbackUrl, name } = req.body;

    const amountInKobo = amount * 100;
    const paymentReference = stringUtil.generateUniqueReference();

    const senderUserWallet = await walletRepository.getWalletByUserId(req.user?.id!);

    if (!senderUserWallet) {
        logger.error(`Wallet with owner: ${req.user?.id} not found!`)
        throw new ResourceNotFoundError('Wallet Not found!');
    }

    const paymentDetails: paystackApi.InitializePaymentArgs = {
      amount: amountInKobo,
      email,
      callback_url: callbackUrl,
      reference: paymentReference,
      metadata: {
        amount: amountInKobo,
        walletId: senderUserWallet?._id.toString(),
        email,
        name,
      },
    };

    const data = await paystackApi.paystackApiInstance.initializePayment(paymentDetails);

    const transactionDoc = new models.Transaction({
        owner: req.user?.id,
        type: TransactionType.payment,
        amount: amountInKobo,
        code: data.accessCode,
        codeType: TransactionCodeType.accessCode,
        email,
        name,
        transactionReference: paymentReference,
    })

    await transactionRepository.createTransaction(transactionDoc);
    logger.info(`New Transaction created for user: ${req.user?.id}`);

    return data;
};

export const verifyPayment = async (req: Request) => {
    const reference = req.query.reference;

    if (!reference) {
    throw new BadRequestError('Missing transaction reference');
    }
    
    const transaction = await transactionRepository.getTransactionByReference(reference as string);

    if (!transaction) {
        throw new ResourceNotFoundError(`Transaction with payment reference ${reference} was not found`)
    };

    const {
        data: {
            amount: amount,
            status: paymentStatus
        }
    } = await paystackApi.paystackApiInstance.verifyPayment(reference as string);

    if (paymentStatus !== 'success') {
        throw new BadRequestError(`Transaction: ${paymentStatus}`);
    }
    
    if (amount !== transaction.amount) {
        throw new BadRequestError(`Transaction mismatch`);
    }
    
    transaction.status = paymentStatus;
    transaction.save();
    
    return transaction;
};

export const listBanks = async (req:Request) => {
    const defaultCurrency = 'NGN'
    const response = await paystackApi.paystackApiInstance.listBanks(defaultCurrency);

    return response;
};

export const resolveAccountNumber = async (req:Request) => {
    const {accountNumber, bankCode} = req.body

    const response = await paystackApi.paystackApiInstance.resolveAccountNumber(accountNumber, bankCode);

    return response;
};

export const createTransferRecipient = async (req: Request) => {
    const { recipientType, recipientName, recipientAccountNumber, recipientBankCode, currency, description, recipientWalletId } = req.body;

    // Fetch recipient details from the database
    const recipientUserWallet = await walletRepository.getWalletByWalletId(recipientWalletId)
    if(!recipientUserWallet){
        throw new BadRequestError("Recipient does not exist. Please confirm that the recipient's walletId is correct, and try again.");
    }

    if(recipientUserWallet.accountNumber !== recipientAccountNumber || recipientUserWallet.bankCode !== recipientBankCode){
        throw new BadRequestError("WalletId does not match the recipient bank details provided. We suggest you confirm the bank details and try again.");
    }

    const recipientUser = await userRepository.getUserById(recipientUserWallet?.owner!.toString());
    if (!recipientUser){
        logger.info(`User with walletId ${recipientWalletId} not found!`);
        throw new ResourceNotFoundError('Recipient not found!');
    }

    const transferDetails: paystackApi.CreateTransferRecipientArgs = {
        type: recipientType,
        name: recipientName,
        account_number: recipientAccountNumber,
        bank_code: recipientBankCode,
        currency: currency,
        description: description,
        metadata: {
            email: recipientUser.email!,
            name: recipientName,
            walletId: recipientWalletId
        }
    }

    const data = await paystackApi.paystackApiInstance.createTransferRecipient(transferDetails);

    recipientUserWallet.recipientCode = data.recipientCode;
    recipientUserWallet.save()

    return data;
};

export const getTransferRecipient = async (req:Request) => {
    const recipientCode = req.params.recipientCode;

    if (!recipientCode){
        throw new BadRequestError('Missing recipientCode parameter!');
    };
    
    const data = await paystackApi.paystackApiInstance.getRecipientCode(recipientCode);

    return data;
};

export const initiateTransfer = async (req:Request) => {
    const { source,
        reason,
        amount,
        recipientCode,
        recipientAccountNo,
        recipientBankName,
        recipientaccountName,
        recipientWalletId
    } = req.body;

    // Validate amount
    if (amount <= 0) {
        throw new BadRequestError('Invalid amount!');
    }

    const amountInKobo = amount * 100
    const transferReference = stringUtil.generateUniqueReference();

    const transferDetails: paystackApi.InitiateTransferArgs = {
        source,
        reason,
        amount: amountInKobo,
        recipient: recipientCode,
        reference: transferReference
    };

    const data = await paystackApi.paystackApiInstance.initiateTransfer(transferDetails);

    const transactionDoc = new models.Transaction({
        owner: req.user?.id,
        type: TransactionType.transfer,
        amount: amountInKobo,
        recipientAccountNo,
        recipientBankName,
        recipientaccountName,
        recipientWalletId,
        code: data.transferCode,
        codeType: TransactionCodeType.transferCode,
        transactionReference: transferReference,
    });
    await transactionRepository.createTransaction(transactionDoc);

    logger.info(`New Transaction created for user with id: ${req.user?.id}`);

    return data;
};

export const finalizeTransfer = async (req:Request) => {
    const {transferCode, otp} = req.body;

    const transferDetails: paystackApi.FinalizeTransferArgs = {
        transfer_code: transferCode,
        otp: otp
    };

    const response = await paystackApi.paystackApiInstance.finalizeTransfer(transferDetails);

    return response;
};

export const verifyTransfer = async (req:Request) => {
    const transactionReference = req.params.reference;

    if (!transactionReference) {
        throw new BadRequestError('Missing transaction reference');
    };
    
    const transaction = await transactionRepository.getTransactionByReference(transactionReference);
    
    if (!transaction) {
        throw new ResourceNotFoundError('Transaction not found!')
    };

    const response = await paystackApi.paystackApiInstance.verifyTransfer(transactionReference);

    if (response.status !== "success"){
        throw new BadRequestError(`Transfer: ${response.status}`)
    }    
    
    if(!transaction || transaction.amount !== response.amount || transaction.currency !== response.currency && transaction.code === response.transferCode){
        throw new BadRequestError('Invalid transaction')
    }
    
    const walletId = response.recipient.metadata.walletId;

    if (!walletId){
        throw new BadRequestError('Invalid request')
    }

    const recipientWallet = await walletRepository.getWalletByWalletId(walletId);
    recipientWallet!.balance += response.amount;
    recipientWallet?.save()

    transaction.status = response.status;
    transaction.save();

    logger.info(`Transfer transaction with reference: ${transactionReference} was completed successfully`);

    return transaction;
};

export const getTransferUpdateWebhook = async(req:Request) => {
    //validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        throw new BadRequestError('Invalid Request!')
    }
    
    const {event,
        data:{
            amount: transferAmount,
        currency: transferCurrency,
        status: transferStatus,
        reference: transferReference,
        transfer_code: code,
        recipient:{
            metadata:{
                walletId: recipientWalletId
            }
        }
    }} = req.body
    
    if (!event || !transferAmount || !transferCurrency || !transferStatus || !transferCurrency || !code || !recipientWalletId){
        throw new BadRequestError('Invalid Request!')
    }

    const transaction = await transactionRepository.getTransactionByReference(transferReference);

    if(!transaction || transaction.amount !== transferAmount || transaction.currency !== transferCurrency && transaction.code === code){
        throw new BadRequestError('Invalid transaction')
    }
    
    switch (event) {
        case 'transfer.success':
            const recipientWallet = await walletRepository.getWalletByWalletId(recipientWalletId);
            recipientWallet!.balance += transferAmount;
            recipientWallet?.save()

            transaction.status = transferStatus;
            transaction.save();

            logger.info(`Transfer transaction with reference: ${transferReference} was completed successfully`);
          break;
        case 'transfer.failed':
            transaction.status = transferStatus;
            transaction.save();

            logger.info(`Transfer transaction with reference: ${transferReference} Failed`);
          break;
        case 'transfer.reversed':
            transaction.status = transferStatus;
            transaction.save();

            logger.info(`Transfer transaction with reference: ${transferReference} was successfully reversed`);
          break;
        default:
            logger.info(`Response received with unknown event: ${event}`);
        break;
    }
    return true;
};

export const listTransfers = async (req: Request) => {
    const transferDocs = await transactionRepository.getTransactionByUserIdAndType(req.user?.id!, TransactionType.transfer);

    return transferDocs;
};

export const getTransferByTransactionId = async (req:Request) => {
    const transactionId = req.params.transactionId;

    if(!transactionId){
        throw new BadRequestError('Missing transaction id');
    }

    const transferDoc = await transactionRepository.getTransactionById(transactionId);

    if(!transferDoc){
        logger.info(`transaction with id: ${transactionId} not found!`)
        throw new ResourceNotFoundError(`transaction with id: ${transactionId} not found!`);
    };

    return transferDoc;
};