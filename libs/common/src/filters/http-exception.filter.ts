import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger();

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const {
      url,
      httpVersion,
      headers,
      hostname,
      method,
      body,
      baseUrl,
      originalUrl,
    } = request;
    const req = {
      method,
      url,
      baseUrl,
      originalUrl,
      headers,
      hostname,
      httpVersion,
      body,
    };
    const { getHeaders } = response;
    this.logger.error(
      {
        httpMessage: 'Response',
        request: req,
        response: {
          statusCode: status,
          getHeaders,
        },
        err: exception,
      },
      exception.stack,
      `httpExceptionFilter`,
    );

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
