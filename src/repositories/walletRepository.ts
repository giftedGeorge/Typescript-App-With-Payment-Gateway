import models from '../models';
import logger from '../logger';
import { InternalServerError } from '../errors';


export async function createWallet(walletDoc:object){
    try {
        const document = await models.Wallet.create(walletDoc);
        return document;
    } catch (error) {
        logger.error(`Error creating wallet doc, ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
};

export async function getWalletByUserId(userid: string){
    try {
        const document = await models.Wallet.findOne({ owner: userid });
        return document;
    } catch (error) {
        logger.error(`Error creating wallet doc, ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
};

export async function getWalletByWalletId(walletid: string){
    try {
        const document = await models.Wallet.findById(walletid);
        return document;
    } catch (error) {
        logger.error(`Error retrieving wallet doc, ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
};