import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { types } from 'pg';

async function bootstrap() {
  types.setTypeParser(1082, (val: string) => val);
  types.setTypeParser(1083, (val: string) => val);
  types.setTypeParser(1114, (val: string) => val);
  types.setTypeParser(1184, (val: string) => val);
  
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan validasi input secara global
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // --- SETUP SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('API System')
    .setDescription('Daftar Endpoint API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'jwt-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // ----------------------

  // await app.listen(process.env.PORT ?? 3000);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
