import express from 'express';
const userRouter = express.Router();
import {userController} from '../controllers';
import middleware from '../middlewares';
import {CreateUserRequestModel, LoginRequestModel } from '../requestModels';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequestModel:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - pin
 *       properties:
 *         phoneNumber:
 *           type: string
 *           required: true
 *           description: The user's phone number that was verified during registeration.
 *         pin:
 *           type: string
 *           required: true
 *           description: The pin created by the user during registeration.
 * 
 *     OtherResponseModel:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 * 
 *     TokenModel:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *         token_type:
 *           type: string
 *         expires_in:
 *           type: integer
 *         refresh_token:
 *           type: string
 * 
 *     CreateUserRequestModel:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - firstName
 *         - lastName
 *         - email
 *         - bvn
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the user.
 *         firstName:
 *           type: string
 *           description: First name of the user.
 *         lastName:
 *           type: string
 *           description: Last name of the user.
 *         email:
 *           type: string
 *           description: Email address of the user.
 *         bvn:
 *           type: string
 *           description: Bank verification number of the user.
 * 
 *     UserDto:
 *       type: object   
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the user.
 *         firstName:
 *           type: string
 *           description: First name of the user.
 *         lastName:
 *           type: string
 *           description: Last name of the user.
 *         email:
 *           type: string
 *           description: Email address of the user.
 *         bvn:
 *           type: string
 *           description: Bank verification number of the user.
 *         isInterestAllowed:
 *           type: boolean
 * 
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
*/



/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User Login
 *     description: Uses provided information to log users in and grant them access to our services. Provides access and refresh tokens to access authorized resources during the session.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequestModel'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenModel'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtherResponseModel'
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtherResponseModel'
*/
userRouter.post('/login', middleware.validateRequest(LoginRequestModel), middleware.authenticateUser, userController.login);

userRouter.use(middleware.validateAccessToken);

/**
 * @swagger
 * /api/users/create-user:
 *   put:
 *     summary: Create a new user
 *     description: Use provided information to create the new user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequestModel'
 *     responses:
 *       201:
 *         description: Created 
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtherResponseModel'
 *       401:
 *         description: Unauthorized 
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       500:
 *         description: Internal Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtherResponseModel'
*/
userRouter.put('/create-user', middleware.validateRequest(CreateUserRequestModel), userController.createUser);


export default userRouter;