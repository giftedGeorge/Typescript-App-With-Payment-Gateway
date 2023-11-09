import twilio from 'twilio';
import logger from '../logger';
import dotenv from 'dotenv';
dotenv.config();

const accountSid: string = process.env.TWILIO_SID!;
const authToken: string = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);


function generateOTP() {
    const otp: number = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    return otp.toString();
  }

async function sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
  try {
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: '+14092917797',
      to: phoneNumber,
    });

    if (message.status === 'undelivered' || message.status === 'failed') {
      return false;
    } else {
      logger.info(`OTP sent with SID: ${message.sid}, to phone number: ${phoneNumber}`);
      return true;
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error sending OTP: ${error.message}`);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}  

  export {
    generateOTP,
    sendOTP
  }
  
