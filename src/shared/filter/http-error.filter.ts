import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
// import { BaseLogger } from './common-base/logger.service';
// import * as jwt from 'jsonwebtoken';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {

  constructor() { }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const authorization = (`${request.headers.authorization}`.split('Bearer '))[1];

    if (exception.getStatus() === HttpStatus.UNAUTHORIZED) {
      if (typeof exception.response !== 'string') {
        exception.response['message'] = exception.response.message || 'You do not have permission to access this resource';
      }
    } /* else if (exception.getStatus() == HttpStatus.FORBIDDEN) {
      const bearer = jwt.decode(authorization);
      if (bearer[`exp`]) {
        if (bearer[`exp`] < (Date.now() / 1000)) {
          // Logger.error(bearer[`exp`], 'ExceptionFilter');
          if (typeof exception.response !== 'string') {
            exception.response['message'] = exception.response.message || 'You do not have permission to access this resource';
          }
        }
      }
    } */

    const errorResponse = {
      error: exception.message.error,
      error_status: status,
      error_description: "error : " + (typeof exception.message.message !== 'undefined' ? exception.message.message : exception.message),
      error_at: new Date(),
      error_uri: "https://developer.emeraldtech.co/document/error/",
      error_path: request.url,
      error_on: "0.1",
      state: null,
      error_method: request.method,
      error_fields: [],
      error_data: {},
    };
    /* Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    ); */

    response
      .status(status)
      .json(errorResponse);
  }
}
