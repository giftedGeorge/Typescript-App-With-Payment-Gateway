import models from '../models';
import logger from '../logger';
import { InternalServerError } from '../errors';


async function createSignUp(signUpDetails:object){
    try {
        await models.SignUp.create(signUpDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating Sign Up: ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
}

async function getSignUpByPhoneNumber(phoneNumber:string){
    try {
        return await models.SignUp.findOne({ phoneNumber: phoneNumber });
    } catch (error) {
        logger.error(`Something went wrong while retrieving sign up doc: ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
}

async function createOTP(otpDetails:object){
    try {
        await models.Otp.create(otpDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating OTP: ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
}

async function getOtpByPhoneNumber(phoneNumber:string){
    try {
        return await models.Otp.findOne({ phoneNumber: phoneNumber });
    } catch (error) {
        logger.error(`Something went wrong while retrieving OTP doc: ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
}

async function getUserLoginByPhoneNumber(phoneNumber:string){
    try {
        return await models.UserLogin.findOne({ phoneNumber: phoneNumber });
    } catch (error) {
        logger.error(`Something went wrong while retrieving user login doc: ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
}
export {
    createSignUp,
    getSignUpByPhoneNumber,
    createOTP,
    getOtpByPhoneNumber,
    getUserLoginByPhoneNumber
};