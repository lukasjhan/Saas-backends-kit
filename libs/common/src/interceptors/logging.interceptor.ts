import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const {
      url,
      httpVersion,
      headers,
      hostname,
      ip,
      method,
      params,
      query,
      body,
      baseUrl,
      originalUrl,
    } = request;
    if (originalUrl === '/healthcheck') {
      return next.handle();
    }

    const copiedBody: any = Object.assign({}, body);
    delete copiedBody['password']; // We do not collect user password
    const userAgent = request.get('user-agent') || '';
    const message = `ip: ${ip} / userAgent: ${userAgent} / query: ${JSON.stringify(
      query,
    )} / params: ${JSON.stringify(params)} / body: ${JSON.stringify(
      copiedBody,
    )}`;

    const startTime = Date.now();

    const req = {
      method,
      url,
      baseUrl,
      originalUrl,
      headers,
      params,
      query,
      hostname,
      httpVersion,
      body: copiedBody,
    };

    return next.handle().pipe(
      tap((responseBody) => {
        const responseTime = Date.now() - startTime;
        const { statusCode } = response;

        this.logger.log({
          httpMessage: 'Response',
          request: req,
          response: {
            statusCode,
            headers: response.getHeaders(),
            body: responseBody,
          },
          message,
          responseTime,
        });
      }),
    );
  }
}
