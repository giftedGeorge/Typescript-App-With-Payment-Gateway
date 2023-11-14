import express, { Application, Request } from 'express';
import cors from 'cors';
import connectToDb from './database';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swaggerOptions';
import routes from './routes';
import logger from './logger';
import { PathNotFoundError } from './errors';
import { ErrorHandler } from './middlewares/errorHandler';

const port = process.env.PORT || 5000;

const app:Application = express();

async function startServer (){
    await connectToDb();
    logger.info('Connected to database');

    app.use(cors());
    app.use(express.json());
    
    app.use('/api', routes);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use((req:Request) => {
        throw new PathNotFoundError(req.path);
    })

    app.use(ErrorHandler.handle)

    app.listen(port, () => {
        logger.info(`Server listening at http://localhost:${port}`);
    });
}

export default startServer;