import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditInterceptor } from '../common/audit/audit.interceptor';

@Controller('gateway')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post(':service')
  @UseInterceptors(FileInterceptor('file'))
  async routeRequest(
    @Param('service') service: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('text') text: string,
  ) {
    return this.gatewayService.handleRequest(service, text, file);
  }
}
