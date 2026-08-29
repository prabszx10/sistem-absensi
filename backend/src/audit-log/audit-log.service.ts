import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogService {
  async createLog(logData: any) {
    console.log('Memproses pembuatan audit log:', logData);
    return logData;
  }
}