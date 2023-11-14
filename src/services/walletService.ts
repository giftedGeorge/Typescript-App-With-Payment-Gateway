import {Request} from 'express';
import models from '../models';
import { userRepository, walletRepository } from '../repositories';
import logger from '../logger';
import { InternalServerError } from '../errors';


export const createWallet = async (req:Request) => {
    const {accountNumber, bankCode} = req.body;

    const userDoc = await userRepository.getUserById(req.user?.id!);

    if (!userDoc){
        logger.info(`userDoc not found for user with id: ${req.user?.id}`)
        throw new InternalServerError('An error occured while creating your wallet. Please try again later.');
    };

    const walletDoc = new models.Wallet({
        owner: userDoc?._id,
        accountNumber: accountNumber,
        bankCode: bankCode
    });

    const createdWallet = await walletRepository.createWallet(walletDoc);

    return createdWallet;
};