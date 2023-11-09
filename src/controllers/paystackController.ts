import {paystackApi}  from "../apis";
import { BadRequestError } from "../errors";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import models from "../models";
import { asyncWrapper } from "../utils/asyncWrapper";



const initializePayment = asyncWrapper(async (req: Request, res: Response) => {
    const { amount, email, callbackUrl, name } = req.body;

    const paymentDetails: paystackApi.InitializePaymentArgs = {
      amount,
      email,
      callback_url: callbackUrl,
      metadata: {
        amount,
        email,
        name,
      },
    };

    const data = await paystackApi.paystackApiInstance.initializePayment(paymentDetails);

    return res.status(StatusCodes.OK).send({
      message: 'Payment initialized successfully',
      data,
    });
  });

  const verifyPayment = asyncWrapper(async (req: Request, res: Response) => {
    const reference = req.query.reference;

    if (!reference) {
      throw new BadRequestError('Missing transaction reference');
    }

    const {
      data: {
        metadata: { email, amount, name },
        reference: paymentReference,
        status: transactionStatus,
      },
    } = await paystackApi.paystackApiInstance.verifyPayment(reference as string);

    if (transactionStatus !== 'success') {
      throw new BadRequestError(`Transaction: ${transactionStatus}`);
    }

    const transaction = await models.Transaction.findOne({ paymentReference });

    if (!transaction) {
        const newTransaction = await models.Transaction.create({
            owner: req.user?.id,
            amount,
            email,
            name,
            paymentReference,
        });
    
        return res.status(StatusCodes.OK).send({
            message: 'Payment verified',
            data: newTransaction,
          });
    }

    return res.status(StatusCodes.OK).send({
      message: 'Payment verified',
      data: transaction,
    });
  });


export {
    initializePayment,
    verifyPayment
};