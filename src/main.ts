import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import momentTimezone from 'moment-timezone';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { Logger } from '@nestjs/common';
const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor,new TimeoutInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter());

  
  await app.listen(8080);
  logger.log('Api-Gateway is listening')
}
bootstrap();
