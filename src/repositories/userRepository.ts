import models from '../models';
import logger from '../logger';

async function createUser(userDetails:object){
    try {
        await models.User.create(userDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating user: ${error}`);
        throw error;
    }
}

async function createUserLogin(userLoginDetails:object){
    try {
        await models.UserLogin.create(userLoginDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating a userLogin: ${error}`);
        throw error;
    }
}

async function getUserByPhoneNumber(phoneNumber:string){
    return await models.User.findOne({ phoneNumber: phoneNumber });
}

export{
    getUserByPhoneNumber,
    createUserLogin,
    createUser,
};