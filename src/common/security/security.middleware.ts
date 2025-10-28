import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors'; // ✅ FIXED import
import { securityConfig } from './security.config';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private limiter = rateLimit(securityConfig.rateLimit);
  private corsMiddleware = cors(securityConfig.cors); // ✅ initialize once
  private helmetMiddleware = helmet(securityConfig.helmet); // ✅ initialize once

  use(req: Request, res: Response, next: NextFunction) {
    // Apply security headers
    this.helmetMiddleware(req, res, () => {
      // Apply CORS
      this.corsMiddleware(req, res, () => {
        // Apply rate limiting
        this.limiter(req, res, next);
      });
    });
  }
}
