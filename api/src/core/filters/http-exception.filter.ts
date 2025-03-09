import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  details?: string;

  [key: string]: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Get the exception response
    const errorResponse = exception.getResponse() as ErrorResponse | string;

    // Determine error message
    let errorMessage: string | string[];
    let errorDetails: string | null = null;
    let errorCode: string;

    if (typeof errorResponse === 'string') {
      errorMessage = errorResponse;
      errorCode = HttpStatus[status] || 'UNKNOWN_ERROR';
    } else {
      errorMessage = errorResponse.message || 'An error occurred';
      errorDetails = errorResponse.details || null;
      errorCode = errorResponse.error || HttpStatus[status] || 'UNKNOWN_ERROR';
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status}: ${
        typeof errorMessage === 'string'
          ? errorMessage
          : JSON.stringify(errorMessage)
      }`,
    );

    // Create a standardized error response
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorMessage,
      ...(errorDetails && { details: errorDetails }),
      error: errorCode,
    };

    response.status(status).json(responseBody);
  }
}
