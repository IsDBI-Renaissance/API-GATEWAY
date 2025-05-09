import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import * as cors from 'cors';
import { securityConfig } from './security.config';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private limiter = rateLimit(securityConfig.rateLimit);

  use(req: Request, res: Response, next: NextFunction) {
    // Apply security headers
    helmet(securityConfig.helmet)(req, res, () => {
      // Apply CORS
      cors(securityConfig.cors)(req, res, () => {
        // Apply rate limiting
        this.limiter(req, res, next);
      });
    });
  }
} 