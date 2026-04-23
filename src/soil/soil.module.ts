import { Module } from '@nestjs/common';
import { SoilService } from './soil.service';
import { SoilController } from './soil.controller';

@Module({
  providers: [SoilService],
  controllers: [SoilController],
})
export class SoilModule {}
