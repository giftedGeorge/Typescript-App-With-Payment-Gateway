import {authService} from '../services';
import * as errors from '../errors';
import {Request, Response} from 'express';
import { asyncWrapper } from '../utils/asyncWrapper';

const signUp = asyncWrapper(async (req: Request, res: Response) => {
    const result = await authService.signUp(req);
    
    if(!result){
        throw new errors.BadRequestError('An error ocurred while signing up. Please check your values and try again');
    }
    return res.status(200).json(result);
});

const validateOtp = asyncWrapper(async (req:Request, res:Response) => {
    const result = await authService.validateOtp(req);
    
    if(!result || result !== true){
        throw new errors.BadRequestError('An error ocurred while signing up. Please check your values and try again');
    }
    return res.status(200).json({message: 'OTP validated successfully'});
});

const createPin = asyncWrapper( async (req:Request, res:Response) => {
    const result = await authService.createPin(req);
    
    if(!result || result !== true){
        throw new errors.BadRequestError('An error ocurred while signing up. Please check your values and try again');
    }
    return res.status(200).json({message: 'Pin created successfully'});
});

export{
    signUp,
    validateOtp,
    createPin,
}