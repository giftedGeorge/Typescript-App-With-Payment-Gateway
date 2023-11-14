import {walletService} from '../services';
import {Request, Response} from 'express';
import { asyncWrapper } from '../utils/asyncWrapper';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors';

export const createWallet = asyncWrapper( async (req:Request, res:Response) => {
    const createdWallet = await walletService.createWallet(req);

    if(!createdWallet){
        throw new BadRequestError('An error ocurred while signing up. Please check your values and try again');
    };

    res.status(StatusCodes.CREATED).send(createdWallet);
});