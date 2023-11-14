import swaggerJsDoc from 'swagger-Jsdoc';
const port = process.env.PORT || 5000;
const baseUrl = process.env.BASE_URL || 'http://localhost';

const swaggerOptions: swaggerJsDoc.Options = {
    definition: {
        tryItOutEnabled: true,
        openapi: '3.0.0',
        info: {
            title: 'Thrindle Test',
            version: '1.0.0',
            description: 'API documentation for a thrindle test project',
        },
        servers: [
            {
                url:`${baseUrl}:${port}`
            }
        ],
    },
    // API ROUTES
    apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerJsDoc(swaggerOptions);
export default swaggerSpec;