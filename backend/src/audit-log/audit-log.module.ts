import { Module } from '@nestjs/common';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';
import { EventsGateway } from '../events/events.gateway';

@Module({
  controllers: [AuditLogController], // <--- Pastikan Controller ini ada
  providers: [AuditLogService,EventsGateway],
})
export class AuditLogModule {}