import { Module } from '@nestjs/common';
import { IndeedController } from './indeed.controller';
import { IndeedService } from './indeed.service';
import { LocationStorageService } from './location.storage';

@Module({
  controllers: [IndeedController],
  providers: [IndeedService, LocationStorageService]
})
export class IndeedModule {}
