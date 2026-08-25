import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan validasi input secara global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // await app.listen(process.env.PORT ?? 3000);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
