import {google} from 'googleapis';
import nodemailer from 'nodemailer';
import logger from '../logger';

const clientId = process.env.GOOGLE_API_CLIENT_ID;
const clientSecret = process.env.GOOGLE_API_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_API_REDIRECT_URI!;
const refreshToken = process.env.GOOGLE_API_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
oauth2Client.setCredentials({refresh_token: refreshToken});

export async function sendMailAsync(fromMail:string, toMail:string, body:string, subject:string): Promise<boolean> {
    try {
        const accessToken = await oauth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: fromMail,
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: String(accessToken)
            }
        })

        const mailOptions = {
            from: fromMail,
            to: toMail,
            subject: subject,
            html: body
        };

        const result = await transport.sendMail(mailOptions);
        if (!result.response.startsWith("250")){
            logger.info(`Error sending mail to ${toMail}`,result);
            return false;
        }
        return true;
    } catch (error) {
        logger.error('An Error Occured while sending email!', error);
        throw error;
    }
}