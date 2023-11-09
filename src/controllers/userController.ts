import {userService} from '../services';
import {Request, Response} from 'express';
import * as errors from '../errors';
import { asyncWrapper } from '../utils/asyncWrapper';


const createUser = asyncWrapper( async (req:Request, res:Response) => {       
    const result = await userService.createUser(req);
    
    if(!result || result !== true){
        throw new errors.BadRequestError('An error ocurred while creating user. Please try again');
    }
    return res.status(201).send();
});

const login = asyncWrapper( async (req:Request, res:Response) => {    
    const result = await userService.login(req);
    
    if(!result){
        throw new errors.BadRequestError('An error ocurred while logging in. Please check your values and try again');
    }
    return res.status(200).json(result);
});

export {
    createUser,
    login,
}