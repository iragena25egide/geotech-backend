import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoilService } from './soil.service';
import { SoilController } from './soil.controller';
import { SoilSample } from '../entities/soil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SoilSample])],
  providers: [SoilService],
  controllers: [SoilController],
})
export class SoilModule {}
