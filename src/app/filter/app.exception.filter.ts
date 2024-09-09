import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express'; // Assuming you're using Express under the hood

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Getting the original response object
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    // // Returning appropriate error response
    // response.status(status).json({
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // });

    // Invoke the base class catch method
    super.catch(exception, host);
  }
}
