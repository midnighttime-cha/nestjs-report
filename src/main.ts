import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
import { HttpExceptionFilter } from './shared/filter/http-exception.filter';
const bodyParser = require('body-parser');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

const port = process.env.HOST_PORT || 3003;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    logger: false,
  });
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/v1');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const swaggerCustomOptions = {
    swaggerOptions: { docExpansion: 'list', defaultModelsExpandDepth: -1, filter: true },
  };
  const setVersion = '1.0 build 20200320.0153';

  const options = new DocumentBuilder()
    .addServer(`${process.env.API_PROD_HOST}`, 'PROD: Report API')
    .addServer(`${process.env.API_HOST}:${process.env.API_HOST_PORT}`, 'Local: Report API')
    .setTitle('Report API')
    .setDescription('The report API description')
    .setVersion(setVersion)
    .addBearerAuth()
    .setContact('Report', `${process.env.API_HOST}`, `${process.env.API_EMAIL}`)
    .addTag('Authentication & Access')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs/api/v1', app, document, swaggerCustomOptions);

  await app.listen(port);
  await Logger.warn("==============================")
  await Logger.log(`Server running on ${process.env.API_HOST}:${port}`, 'Bootstrap');
  await Logger.warn("==============================")
}
bootstrap();
