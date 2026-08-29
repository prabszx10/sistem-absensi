// src/events/events.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // Method untuk broadcast ke FE
  notifyProfileUpdated(data: any) {
    this.server.emit('notification:profile_updated', {
      message: 'Profil berhasil diperbarui dan audit log telah dicatat',
      data,
    });
  }
}