import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.setGlobalPrefix('api');

    // Configure session middleware
    // app.use(
    //   session({
    //     name: 'NESTJS_SESSION',
    //     secret: process.env.SESSION_KEY,
    //     resave: false,
    //     saveUninitialized: false,
    //   }),
    // );
  
  const config = new DocumentBuilder()
  .setTitle('job-map API')
  .setDescription('Job-Map api documentation')
  .setVersion('1.0')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'access-token',
  )
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  console.log('TOC is listening on port 3000')
}
bootstrap();
