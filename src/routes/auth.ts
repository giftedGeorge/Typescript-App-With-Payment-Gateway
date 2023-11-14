import express from 'express';
const router = express.Router();
import {authController} from '../controllers';
import middleware from '../middlewares';
import 'swagger-Jsdoc';
import { SignUpRequestModel, ValidateOtpRequestModel, CreatePinRequestModel } from '../requestModels';


/**
 * @swagger
 * components:
 *   schemas:
 *     SignUpRequestModel:
 *       description: SignUp object that will be used to initiate the sign up process.
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           required: true
 *           description: The user's phone number that was verified during registeration.
 *         userType:
 *           type: number
 *           description: The selected type of the user. Enter 1 for "individual", 2 for "agent"
 *         isInterestAllowed:
 *           type: boolean
 *           description: true or false based on user selection.
 * 
 *     ValidateOtpRequestModel:
 *       description: OTP validation object that contains information to be used in validating the OTP.
 *       type: object
 *       required:
 *         - phoneNumber
 *         - otpCode
 *       properties:
 *         phoneNumber:
 *           type: string
 *           required: true
 *           description: The user's phone number that was verified during registeration.
 *         otpCode:
 *           type: string
 *           description: The 6-digit one time password sent to the user.
 * 
 *     CreatePinRequestModel:
 *       description: CreatePin object that contains information to be used in creating a pin for the user.
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
 *           description: The 6-digit pin code entered by the user.
 * 
 *     SignUpTokenModel:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *         token_type:
 *           type: string
 *         expires_in:
 *           type: integer
 * 
 *     OtherResponseModel:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 * 
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 */





/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Get a One time password from the API
 *     description: Use provided information to begin sign-up process. Send a one time password to provided phone number and provdes a temporary access token to access the subsequent resources to complete the sign-up process.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequestModel'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignUpTokenModel'
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
router.post('/signup', middleware.validateRequest(SignUpRequestModel), authController.signUp);

router.use(middleware.validateAccessToken)

/**
 * @swagger
 * /api/auth/validate-otp:
 *   post:
 *     summary: Validate OTP
 *     description: Use provided information to validate the otp sent to the user.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidateOtpRequestModel'
 *     responses:
 *       200:
 *         description: Successful response
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
router.post('/validate-otp', middleware.validateRequest(ValidateOtpRequestModel), authController.validateOtp);

/**
 * @swagger
 * /api/auth/create-pin:
 *   post:
 *     summary: Create a pin.
 *     description: Use provided information to create a pin which will be used for logging in and authentication.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePinRequestModel'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OtherResponseModel'
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
router.post('/create-pin', middleware.validateRequest(CreatePinRequestModel), authController.createPin);

export default router;