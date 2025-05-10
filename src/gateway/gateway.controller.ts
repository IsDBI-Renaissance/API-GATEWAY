import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  UseGuards,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GatewayService } from './gateway.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditInterceptor } from '../common/audit/audit.interceptor';
import { Service1Dto, Service2Dto, Service4Dto } from './dto/gateway.dto'; // Import DTOs

@Controller('gateway')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('service1')
  @UseInterceptors(FileInterceptor('file'))
  async handleService1(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new FileTypeValidator({ fileType: '.(pdf|docx|doc|xlsx|xls|pptx|ppt|odt|ods|odp|txt|md|csv|json|xml|html|htm|rtf)' }),
          // new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // Example: 10MB
        ],
        fileIsRequired: false, // Make file optional if text can be standalone
      }),
    )
    file: Express.Multer.File,
    @Body() body: Service1Dto, // Use DTO for body, text is part of it
  ) {
    return this.gatewayService.handleService1Request(body.text, file);
  }

  @Post('service2')
  async handleService2(
    @Body() data: Service2Dto, // Service2 now takes Service2Dto as JSON body
  ) {
    return this.gatewayService.handleService2Request(data); // Corrected: Calls the service method that handles Service2Dto
  }

  @Post('service3')
  @UseInterceptors(FileInterceptor('file')) // Service3 now handles file/text
  async handleService3(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          // new FileTypeValidator({ fileType: 'your_allowed_extensions_regex' })
        ],
        fileIsRequired: false, // File is optional
      }),
    )
    file: Express.Multer.File,
    @Body() body: Service1Dto, // Service3 now takes text via Service1Dto, similar to Service1
  ) {
    return this.gatewayService.handleService3Request(body.text, file); // Corrected: Calls the service method that handles text/file
  }

  @Post('service4')
  async handleService4(
    @Body() service4Dto: Service4Dto,
  ) {
    return this.gatewayService.handleService4(service4Dto);
  }
}
