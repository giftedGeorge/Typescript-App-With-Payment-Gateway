import models from '../models';
import argon2 from 'argon2';
import {otpUtil, jwtUtil} from '../utils';
import {userRepository, authRepository} from '../repositories';
import {Request} from 'express';
import logger from '../logger';
import * as errors from '../errors';
const tokenType:string = 'Bearer';

async function signUp (req: Request){
    const phoneNumString:string = String(req.body.phoneNumber);

    const signUpDoc = new models.SignUp({
        phoneNumber: req.body.phoneNumber,
        userType: req.body.userType,
        isInterestAllowed: req.body.isInterestAllowed
    });

    const otp:string = otpUtil.generateOTP();

    const existingUser = await userRepository.getUserByPhoneNumber(phoneNumString);
    if(existingUser){
        logger.error(`SignUp with phoneNumber: ${phoneNumString} has already been verified `);
        throw new errors.BadRequestError('This phone number has already been verified!');
    }

    const existingSignUp = await authRepository.getSignUpByPhoneNumber(phoneNumString);
    if(existingSignUp && existingSignUp.isPhoneNumberVerified === true){
        logger.error(`SignUp with phoneNumber: ${phoneNumString} has already been verified `);
        throw new errors.BadRequestError('This phone number has already been verified!');
    }

    if(existingSignUp && existingSignUp.isPhoneNumberVerified === false){
        const sendOtpResult = await otpUtil.sendOTP(phoneNumString, otp);
        if(sendOtpResult !== true){
            logger.error(`Failed to send OTP to phone number: ${phoneNumString}`);
            throw new errors.BadRequestError('An error ocurred while signing you up. Please check to make sure your phone number is valid, and then try again.');
        }
        logger.info(`OTP was successfully sent to phone number: ${phoneNumString}`);

        const createdSignUp = await authRepository.getSignUpByPhoneNumber(phoneNumString);
        
        if(!createdSignUp){
            logger.error(`no SignUp was found for phone number: ${phoneNumString}`);
            throw new errors.BadRequestError('An error ocurred while signing you up. Please check to make sure your phone number is valid, and then try again.');
        }
        logger.info(`found one SignUp with phone number: ${createdSignUp.phoneNumber}`);

        const existingOtp = await authRepository.getOtpByPhoneNumber(phoneNumString);
        if (!existingOtp) {
            logger.error(`OTP doc not found for phone number: ${phoneNumString}`);
            throw new errors.BadRequestError('An error ocurred while signing you up. Please check to make sure your phone number is valid, and then try again.');
        }

        existingOtp.code = await argon2.hash(otp);
        await existingOtp.save();
        logger.info(`OTP for signUp with phone number: ${createdSignUp.phoneNumber} was updated successfully`);

        const payload = { userId: createdSignUp._id, phoneNumber: createdSignUp.phoneNumber };
        const tempAccessToken = jwtUtil.generateAccessToken(payload, process.env.TEMP_ACCESS_TOKEN_EXPIRATION_TIME!);

        return {
            access_token: tempAccessToken, 
            token_type: tokenType, 
            expires_in: parseInt(process.env.TEMP_ACCESS_TOKEN_EXPIRATION_TIME!) * 60
        }; 
    }
    
    await authRepository.createSignUp(signUpDoc);
    logger.info(`new signUp with phone number ${phoneNumString} was successfully created in SignUps collection`);
    
    const sendOtpResult = await otpUtil.sendOTP(phoneNumString, otp);
    if(sendOtpResult !== true){
        logger.error(`Failed to send OTP to ${phoneNumString}`);
        throw new errors.BadRequestError('An error ocurred while signing you up. Please check to make sure your phone number is valid, and then try again.');
    }
    logger.info(`OTP was successfully sent to ${phoneNumString}`);

    const createdSignUp = await authRepository.getSignUpByPhoneNumber(phoneNumString);
    
    if(!createdSignUp){
        logger.error(`no SignUp was found for phone number: ${phoneNumString}`);
        throw new errors.BadRequestError('An error ocurred while signing you up. Please check to make sure your phone number is valid, and then try again.');
    }
    logger.info(`found one SignUp with phone number: ${createdSignUp.phoneNumber}`);

    const otpDoc = new models.Otp({
        phoneNumber: phoneNumString,
        code: await argon2.hash(otp),
    });
    await authRepository.createOTP(otpDoc);
    logger.info(`OTP was successfully created in Otps collection`);
    
    const payload = { userId: createdSignUp._id, phoneNumber: createdSignUp.phoneNumber };
    const tempAccessToken = jwtUtil.generateAccessToken(payload, process.env.TEMP_ACCESS_TOKEN_EXPIRATION_TIME!);
    
    return {
        access_token: tempAccessToken, 
        token_type: tokenType, 
        expires_in: parseInt(process.env.TEMP_ACCESS_TOKEN_EXPIRATION_TIME!) * 60
    };
};


async function validateOtp(req: Request){
    const phoneNumber:string = req.body.phoneNumber;
    const otpCode:string = req.body.otpCode;

    // Verify that the phone number in the JWT matches the request's phone number
    if (phoneNumber !== req.user?.phoneNumber) {
        logger.error('Phone number mismatch. Token is invalid!');
        throw new errors.UnauthorizedError('Invalid Token!');
    }

    // Find the signup document
    const userSignUp = await authRepository.getSignUpByPhoneNumber(phoneNumber);

    if (!userSignUp) {
        logger.error(`SignUp not found for phone number: ${phoneNumber}`);
        throw new errors.BadRequestError('An error ocurred while signing you up. Please check to make sure your phone number is valid, and then try again.');
    }

    // Check if isPhoneNumberVerified is false
    if (userSignUp.isPhoneNumberVerified) {
        logger.error(`Phone number: ${phoneNumber} has already been verified`);
        throw new errors.BadRequestError('This phone number has already been verified!');
    }

    // Find the OTP document matching the phone number
    const otpDoc = await authRepository.getOtpByPhoneNumber(phoneNumber);

    if (!otpDoc) {
        logger.error(`OTP doc not found for phone number: ${phoneNumber}`);
        throw new errors.BadRequestError('An error ocurred while signing you up. Please check to make sure your phone number is valid, and then try again.');
    }

    // Check if the hashed OTP code from the request matches the stored hash
    const isOtpMatch = await argon2.verify(otpDoc.code, otpCode);

    if (!isOtpMatch) {
        throw new errors.BadRequestError('An Error occurred while validating the OTP. Either the OTP is incorrect, or its validity period has expired. Please try again, or request for another OTP');
    }

    // Check if the OTP code has expired
    const expirationTime = otpDoc.updatedAt.getTime() + parseInt(process.env.OTP_EXPIRATION_TIME!) * 60000;
    if (expirationTime < Date.now()) {
        throw new errors.BadRequestError('An Error occurred while validating the OTP. Either the OTP is incorrect, or its validity period has expired. Please try again, or request for another OTP');
    }

    // Update isPhoneNumberVerified to true in the user document
    userSignUp.isPhoneNumberVerified = true;
    await userSignUp.save();

    // Return success response
    logger.info('Phone number verified successfully');
    return true;    
};

async function createPin(req:Request){
    try {
        const phoneNumber:string = req.body.phoneNumber;
        const pin:string = req.body.pin;
    
        // Verify that the phone number in the JWT matches the request's phone number
        if (phoneNumber !== req.user?.phoneNumber) {
            logger.error('Phone number mismatch. Token is invalid!');
            throw new errors.UnauthorizedError('Invalid Token!');
        }
    
        // Find the signup document
        const userSignUp = await authRepository.getSignUpByPhoneNumber(phoneNumber);
    
        if (!userSignUp) {
            logger.error(`SignUp doc not found for phoneNumber: ${phoneNumber}`);
            throw new errors.BadRequestError('An error ocurred while signing you up. Please check to make sure your phone number is valid, and then try again.');
        }
    
        // Check if isPhoneNumberVerified is true
        if (userSignUp.isPhoneNumberVerified != true) {
            logger.error(`Phone number: ${phoneNumber} has already been verified`);
            throw new errors.BadRequestError('This phone number has already been verified!');
        }
    
        // Create User
        const newUserDoc = new models.User({
            phoneNumber: phoneNumber,
        });
        await userRepository.createUser(newUserDoc);

        const createdUser = await userRepository.getUserByPhoneNumber(phoneNumber);
    
        if (!createdUser) {
            logger.error(`User not found for phoneNumber: ${phoneNumber}`);
            throw new errors.BadRequestError('An error ocurred while signing you up. Please check to make sure your phone number is valid, and then try again.');
        }
    
        // create UserLogin doc
        const newUserLoginDoc = new models.UserLogin({
            userId: createdUser._id,
            phoneNumber: phoneNumber,
            pin: await argon2.hash(pin)
        });
    
        await userRepository.createUserLogin(newUserLoginDoc);
    
        return true
    } catch (err) {
        logger.error('Error creating pin:', err);
        throw err;
    }
}

export {
    signUp,
    validateOtp,
    createPin,
}