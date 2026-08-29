import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuditLogService } from './audit-log.service';
import { EventsGateway } from '../events/events.gateway';

@Controller()
export class AuditLogController {
  constructor(
    private readonly auditLogService: AuditLogService,

    private readonly eventsGateway: EventsGateway,) {}

  // Pattern ini harus SAMA EXACT dengan string yang dipublish dari Publisher
  @EventPattern('employee_profile_updated')
  async handleEmployeeProfileUpdated(@Payload() data: any) {
    console.log('[RabbitMQ Consumer] Pesan diterima:', data);

    await this.auditLogService.createLog({
      employeeId: data.employeeId,
      action: 'UPDATE_PROFILE',
      details: data.changes,
      createdAt: data.updatedAt,
    });

    this.eventsGateway.server.emit('admin_notification', {
        message: `${data.nama} (${data.email}) memperbarui profilnya.`,
        data: data,
    });
  }
}