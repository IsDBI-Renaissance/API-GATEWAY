import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, ip, headers } = request;
    const user = request.user;

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.auditService.log({
            action: `${method} ${originalUrl}`,
            userId: user?.id,
            ipAddress: ip,
            userAgent: headers['user-agent'],
            details: {
              requestBody: request.body,
              responseTime: Date.now() - startTime,
              responseData: data,
            },
            status: 'success',
          });
        },
        error: (error) => {
          this.auditService.log({
            action: `${method} ${originalUrl}`,
            userId: user?.id,
            ipAddress: ip,
            userAgent: headers['user-agent'],
            details: {
              requestBody: request.body,
              responseTime: Date.now() - startTime,
              error: error.message,
            },
            status: 'failure',
          });
        },
      }),
    );
  }
} 