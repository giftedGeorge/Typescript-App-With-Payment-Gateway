import {jwtUtil, stringUtil} from '../utils';
import {userRepository, authRepository} from '../repositories';
import {Request} from 'express';
import logger from '../logger';
import * as errors from '../errors';
import { sendMailAsync } from '../services';
const tokenType:string = 'Bearer';
const fromMail = process.env.FROM_MAIL!;


async function createUser(req:Request){
    const reqBody = req.body
    const phoneNumber:string = reqBody.phoneNumber;

    if (phoneNumber !== req.user?.phoneNumber) {
        logger.error('Phone number mismatch. Token is invalid!');
        throw new errors.UnauthorizedError('Invalid Token!');
    }

    // Find the user document
    const user = await userRepository.getUserByPhoneNumber(phoneNumber);

    if (!user) {
        logger.error(`user not found with phone number: ${phoneNumber}`);
        throw new errors.BadRequestError('An error ocurred while signing you up. Please check to make sure your phone number is valid, and then try again.');
    }

    const userLogin = await authRepository.getUserLoginByPhoneNumber(user.phoneNumber!);

    if(!userLogin || !userLogin.pin){
        logger.error(`User with phone number: ${phoneNumber} has not created a Pin!`);
        throw new errors.BadRequestError('This phone number has not been verified!')
    }

    const userSignUp = await authRepository.getSignUpByPhoneNumber(phoneNumber);
    if(!userSignUp){
        logger.error(`SignUp not found for phone number: ${phoneNumber}`);
        throw new errors.BadRequestError('An error ocurred while signing you up. Please check to make sure your phone number is valid, and then try again.');
    }

    user.firstName = reqBody.firstName;
    user.lastName = reqBody.lastName;
    user.email = reqBody.email;
    user.bvn = reqBody.bvn;
    user.userType = userSignUp.userType;
    user.isInterestAllowed = userSignUp.isInterestAllowed;
    await user.save();

    const templateName = 'welcomeEmail';
    let templateContent = await stringUtil.getEmailTemplate(templateName);
    const modifiedTemplate = templateContent.replace('{{firstName}}', user.firstName!);
    const subject = 'Welcome to Amali'

    const sendMailResponse:boolean = await sendMailAsync(fromMail, user.email!, modifiedTemplate, subject);
    if(!sendMailResponse === true){
        logger.error(`An error occured while sending mail to user with id: ${user._id}`);
    }
    logger.info(`Welcome Email Sent to user with phone number: ${phoneNumber}`);

    return true;
}

async function login(req:Request){
    const refreshToken = jwtUtil.generateRefreshToken(req.user?.id!);
    
    const payload = {id:req.user?.id!, phoneNumber: req.user?.phoneNumber!, firstName: req.user?.firstName!, lastName: req.user?.lastName!}
    const accessToken = jwtUtil.generateAccessToken(payload, process.env.ACCESS_TOKEN_EXPIRATION_TIME!);

    return{
        access_token: accessToken,
        token_type: tokenType,
        expire_in: parseInt(process.env.ACCESS_TOKEN_EXPIRATION_TIME!) * 60,
        refresh_token: refreshToken
    };
}


export {
    createUser,
    login,
}