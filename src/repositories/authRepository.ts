import models from '../models';
import logger from '../logger';


async function createSignUp(signUpDetails:object){
    try {
        await models.SignUp.create(signUpDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating Sign Up: ${error}`);
        throw error;
    }
}

async function getSignUpByPhoneNumber(phoneNumber:string){
    return await models.SignUp.findOne({ phoneNumber: phoneNumber });
}

async function createOTP(otpDetails:object){
    try {
        await models.Otp.create(otpDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating OTP: ${error}`);
        throw error;
    }
}

async function getOtpByPhoneNumber(phoneNumber:string){
    return await models.Otp.findOne({ phoneNumber: phoneNumber });
}

async function getUserLoginByPhoneNumber(phoneNumber:string){
    return await models.UserLogin.findOne({ phoneNumber: phoneNumber });
}
export {
    createSignUp,
    getSignUpByPhoneNumber,
    createOTP,
    getOtpByPhoneNumber,
    getUserLoginByPhoneNumber
};