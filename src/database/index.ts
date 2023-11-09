import mongoose from 'mongoose';
import logger from '../logger';


async function connectToDb(){
    try{
        return mongoose.connect(process.env.MONGO_URI!);
    } catch(e){
        logger.error(e);
        throw e;
    }
}

export default connectToDb;
