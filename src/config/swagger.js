const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gig Worker API',
      version: '1.0.0',
      description: 'API for gig worker features'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./src/routes/**/*.js']
};

module.exports = swaggerJsDoc(swaggerOptions);