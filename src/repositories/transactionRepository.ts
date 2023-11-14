import { InternalServerError } from '../errors';
import models from '../models';
import logger from '../logger';
import { TransactionType } from '../enums';


export async function createTransaction(transactionDoc:object) {
    try {
        const document = await models.Transaction.create(transactionDoc);
        return document;
    } catch (error) {
        logger.error(`Error creating transaction doc, ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
};

export async function getTransactionByReference(reference: string){
    try {
        const document = await models.Transaction.findOne({ transactionReference: reference });
        return document;
    } catch (error) {
        logger.error(`Error retrieving transaction doc, ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
};

export async function getTransactionById(transactionId: string){
    try {
        const document = await models.Transaction.findById(transactionId);
        return document;
    } catch (error) {
        logger.error(`Error retrieving transaction doc, ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
};

export async function getTransactionByUserIdAndType(userId: string, transactionType: TransactionType){
    try {
        const document = await models.Transaction.find({owner:userId, type: transactionType});
        return document;
    } catch (error) {
        logger.error(`Error retrieving transaction doc, ${error}`);
        throw new InternalServerError('An Error occurred while processing your request. Please try again')
    }
}