import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../utils/asyncWrapper";
import {paymentService} from '../services';


const createCustomer = asyncWrapper( async (req:Request, res: Response) => {
    const data = await paymentService.createCustomer(req)

    return res.status(StatusCodes.OK).send(data);
});

const initializePayment = asyncWrapper(async (req: Request, res: Response) => {
    const data = await paymentService.initializePayment(req);

    return res.status(StatusCodes.OK).send({
      message: 'Payment initialized successfully',
      data,
    });
});

const verifyPayment = asyncWrapper(async (req: Request, res: Response) => {
    const transaction = await paymentService.verifyPayment(req);
    
    return res.status(StatusCodes.OK).send({
        message: 'Payment verified',
        data: transaction,
    });
});

const listBanks = asyncWrapper( async (req:Request, res:Response) => {
    const response = await paymentService.listBanks(req);

    return res.status(StatusCodes.OK).send(response)
});

const resolveAccountNumber = asyncWrapper( async (req:Request, res:Response) => {
    const response = await paymentService.resolveAccountNumber(req);

    return res.status(StatusCodes.OK).send(response)
});

const createTransferRecipient = asyncWrapper( async (req: Request, res: Response) => {
    const data = await paymentService.createTransferRecipient(req);

    return res.status(StatusCodes.OK).json({message: 'Transfer Recipient Created successfully',data})
});

const getTransferRecipient = asyncWrapper( async (req:Request, res: Response) => {
    const data = await paymentService.getTransferRecipient(req);

    return res.status(StatusCodes.OK).send(data)
});

const initiateTransfer = asyncWrapper( async (req:Request, res: Response) => {
    const data = await paymentService.initiateTransfer(req);
    return res.status(StatusCodes.OK).send(data);
})

const finalizeTransfer = asyncWrapper( async (req:Request, res:Response) => {
    const response = await paymentService.finalizeTransfer(req);

    return res.status(StatusCodes.OK).send(response);
})

const verifyTransfer = asyncWrapper( async (req:Request, res:Response) => {
    const transaction = await paymentService.verifyTransfer(req);

    return res.status(StatusCodes.OK).send({
      message: 'Transfer verified',
      data: transaction,
    }); 
})

const getTransferUpdateWebhook = asyncWrapper( async(req:Request, res:Response) => {
    await paymentService.getTransferUpdateWebhook(req);
    res.status(StatusCodes.OK).send('Response acknowledged.');
});

const listTransfers = asyncWrapper( async (req: Request, res: Response) => {
    const transferDocs = await paymentService.listTransfers(req);

    if (!transferDocs || transferDocs === null){
        res.status(200).send({transfers: transferDocs, message: "Your transfer history is empty. Make transfers to add to it."})
    }
    
    res.status(200).send({transfers: transferDocs});
});

const getTransferByTransactionId = asyncWrapper( async (req:Request, res: Response) => {
    const transferDoc = await paymentService.getTransferByTransactionId(req);

    res.status(StatusCodes.OK).send(transferDoc);
});


export {
    createCustomer,
    initializePayment,
    verifyPayment,
    createTransferRecipient,
    getTransferRecipient,
    listBanks,
    resolveAccountNumber,
    initiateTransfer,
    finalizeTransfer,
    verifyTransfer,
    getTransferUpdateWebhook,
    getTransferByTransactionId,
    listTransfers
};