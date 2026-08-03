import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env.config';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Gestión de Proyectos y Tareas API',
      version: '1.0.0',
      description: 'API RESTful profesional construida con Node.js, Express, TypeScript, TypeORM y PostgreSQL.',
      contact: {
        name: 'Senior Full Stack Developer',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Servidor Local de Desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido en /api/auth/login',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
