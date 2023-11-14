import models from '../models';
import logger from '../logger';
import { InternalServerError } from '../errors';

async function createUser(userDetails:object){
    try {
        await models.User.create(userDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating user: ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
};

async function createUserLogin(userLoginDetails:object){
    try {
        await models.UserLogin.create(userLoginDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating a userLogin: ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
};

async function getUserByPhoneNumber(phoneNumber:string){
    try {
        return await models.User.findOne({ phoneNumber: phoneNumber });
    } catch (error) {
        logger.error(`Something went wrong while retrieving user document: ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')   
    }
    
};

async function getUserById(userId:string){
    try {
        return await models.User.findById(userId);
    } catch (error) {
        logger.error(`Something went wrong while retrieving user document: ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')   
    }
};

export{
    getUserByPhoneNumber,
    createUserLogin,
    createUser,
    getUserById
};