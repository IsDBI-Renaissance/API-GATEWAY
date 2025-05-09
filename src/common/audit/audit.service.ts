import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './schemas/audit-log.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>,
  ) {}

  async log(data: {
    action: string;
    userId?: string;
    ipAddress: string;
    userAgent: string;
    details: any;
    status: 'success' | 'failure';
  }) {
    const auditLog = new this.auditLogModel({
      ...data,
      timestamp: new Date(),
    });
    await auditLog.save();
  }
} 