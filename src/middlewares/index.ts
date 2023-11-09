import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../logger';
import argon2 from 'argon2';
import {userRepository, authRepository} from '../repositories';
import {Request, Response, NextFunction} from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { sendMailAsync } from '../services';
import { stringUtil } from '../utils';
const fromMail = process.env.FROM_MAIL!;


function validateAccessToken(req:Request, res:Response, next:NextFunction) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      res.status(400).send('Error! Token is missing from the request!');
  }

  try {
      const decodedToken = jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET_KEY!) as JwtPayload;
      req.user = {...req.user, id: decodedToken.id, phoneNumber: decodedToken.phoneNumber, firstName: decodedToken.firstName, lastName: decodedToken.lastName};
      next();
  } catch (error) {
      logger.error(error);
      res.status(401).send('Error! Invalid access token!');
  }
};

function validateUserAuthenticated(req:Request, res:Response, next:NextFunction){
  if(!req.user || !req.user.id || !req.user.phoneNumber || !req.user.firstName || !req.user.lastName){
      return res.status(401).json({ message: 'Unauthorized' });
  }

  return next();
}

async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const { phoneNumber, pin } = req.body;

  if (!phoneNumber || !pin) {
    return res.status(400).json({ message: 'Username and pin are required' });
  }

  const user = await userRepository.getUserByPhoneNumber(phoneNumber);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or pin' });
  }

  const userLogin = await authRepository.getUserLoginByPhoneNumber(user.phoneNumber!);
  
  try {
    const pinMatches = await argon2.verify(userLogin?.pin!, pin);

    if (!pinMatches) {
      return res.status(401).json({ message: 'Invalid username or pin' });
    }

    // If authentication is successful, attach the user's details to the request
    req.user = {...req.user, id: String(user._id), phoneNumber: user.phoneNumber!, firstName: user.firstName!, lastName:user.lastName!};

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
    logger.error('Error verifying pin:', error);
    return res.status(500).json({ message: 'Internal server error' });
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