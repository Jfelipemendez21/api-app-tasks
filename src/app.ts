import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.config';
import { swaggerSpec } from './config/swagger.config';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { ApiResponse } from './utils/apiResponse';

const app: Application = express();

// Security and Logging Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*', // Allows local dev frontend or dynamic host
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Swagger Documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base Health Check Route
app.get('/health', (req: Request, res: Response) => {
  return ApiResponse.success(res, { status: 'UP', timestamp: new Date() }, 'API en funcionamiento');
});

// API Routes
app.use('/api', routes);

// 404 Not Found Handler
app.use((req: Request, res: Response) => {
  return ApiResponse.error(res, `Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404);
});

// Centralized Error Handling Middleware
app.use(errorMiddleware);

export default app;
