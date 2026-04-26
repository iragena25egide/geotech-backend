import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoilSample } from '../entities/soil.entity';

@Injectable()
export class SoilService {
  constructor(
    @InjectRepository(SoilSample)
    private readonly soilRepository: Repository<SoilSample>,
  ) {}

  async create(data: Partial<SoilSample>): Promise<SoilSample> {
    const soil = this.soilRepository.create(data);
    return this.soilRepository.save(soil);
  }

  async findAll(): Promise<SoilSample[]> {
    return this.soilRepository.find();
  }

  async findOne(id: number): Promise<SoilSample | null> {
    return this.soilRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    data: Partial<SoilSample>,
  ): Promise<SoilSample | null> {
    await this.soilRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.soilRepository.delete(id);
  }
}
