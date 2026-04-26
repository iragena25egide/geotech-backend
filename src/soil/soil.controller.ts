import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { SoilService } from './soil.service';
import { SoilSample } from '../entities/soil.entity';

@Controller('soil-samples')
export class SoilController {
  constructor(private readonly soilService: SoilService) {}

  @Post()
  async create(@Body() data: Partial<SoilSample>): Promise<SoilSample> {
    return this.soilService.create(data);
  }

  @Get()
  async findAll(): Promise<SoilSample[]> {
    return this.soilService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SoilSample | null> {
    return this.soilService.findOne(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<SoilSample>,
  ): Promise<SoilSample | null> {
    return this.soilService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.soilService.remove(Number(id));
  }
}
