import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../logger';
import argon2 from 'argon2';
import {userRepository, authRepository} from '../repositories';
import {Request, Response, NextFunction} from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { sendMailAsync } from '../services';
import { stringUtil } from '../utils';
import { BadRequestError, InternalServerError, UnauthorizedError } from '../errors';
const fromMail = process.env.FROM_MAIL!;


function validateAccessToken(req:Request, res:Response, next:NextFunction) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      throw new BadRequestError('Error! Token is missing from the request!');
  }

  try {
      const decodedToken = jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET_KEY!) as JwtPayload;
      req.user = {...req.user, id: decodedToken.id, email: decodedToken.email!, phoneNumber: decodedToken.phoneNumber, firstName: decodedToken.firstName, lastName: decodedToken.lastName};
      next();
  } catch (error) {
      logger.error(error);
      throw new UnauthorizedError('Error! Invalid access token!');
  }
};

function validateUserAuthenticated(req:Request, res:Response, next:NextFunction){
  if(!req.user || !req.user.id || !req.user.phoneNumber || !req.user.firstName || !req.user.lastName || !req.user.email){
    throw new UnauthorizedError('Unauthorized!');
  }

  return next();
}

async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const { phoneNumber, pin } = req.body;

  if (!phoneNumber || !pin) {
    throw new BadRequestError('Username and pin are required');
  }

  const user = await userRepository.getUserByPhoneNumber(phoneNumber);

  if (!user) {
    throw new BadRequestError('Invalid username or pin');
  }

  const userLogin = await authRepository.getUserLoginByPhoneNumber(user.phoneNumber!);
  
  try {
    const pinMatches = await argon2.verify(userLogin?.pin!, pin);

    if (!pinMatches) {
      throw new UnauthorizedError('Invalid username or pin');
    }

    // If authentication is successful, attach the user's details to the request
    req.user = {...req.user, id: String(user._id), email: user.email!, phoneNumber: user.phoneNumber!, firstName: user.firstName!, lastName:user.lastName!};

    //Send Login Notification Email
    const templateName = 'loginNotificationEmail';
    const subject = 'Login notification'
    let templateContent = await stringUtil.getEmailTemplate(templateName);
    const utcTime = new Date().toUTCString();
    let modifiedTemplate = templateContent.replace('{{firstName}}', user.firstName!).replace('{{utcTime}}', utcTime);

    const sendMailResponse:boolean = await sendMailAsync(fromMail, user.email!, modifiedTemplate, subject);
    if(!sendMailResponse === true){
        logger.error(`An error occured while sending mail to user with id: ${user._id}`);
    }
    logger.info(`Login notification email Sent to user with Id: ${user._id}`);
    
    return next();
  } catch (error) {
    logger.error('Error verifying login details:', error);
    throw new InternalServerError('Internal server error');
  };
}

function validateRequest<T>(type: any, skipMissingProperties = false) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    const errors = await validate(dto, { skipMissingProperties });

    if (errors.length > 0) {
      const validationErrors: { [key: string]: string } = {};

      errors.forEach((error: ValidationError) => {
        validationErrors[error.property] = Object.values(error.constraints || {}).join(', ');
      });

      res.status(400).json({ errors: validationErrors });
    } else {
      req.body = dto;
      next();
    }
  };
}

const asyncWrapper = (fn:Function) => {
  return async (req:Request, res:Response, next:NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      logger.error(error);
      next(error)
    }
  }
}


export default {
  validateAccessToken,
  validateUserAuthenticated,
  authenticateUser,
  validateRequest,
  asyncWrapper
}