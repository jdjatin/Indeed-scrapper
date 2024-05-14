import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndeedModule } from './indeed/indeed.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [IndeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
