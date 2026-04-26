import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';
import { Report } from '../entities/report.entity';
import * as fs from 'fs';
import * as path from 'path';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(@Body() data: Partial<Report>): Promise<Report> {
    return this.reportService.create(data);
  }

  @Get()
  async findAll(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Report | null> {
    return this.reportService.findOne(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Report>,
  ): Promise<Report | null> {
    return this.reportService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.reportService.remove(Number(id));
  }

  @Get(':id/download')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const report = await this.reportService.findOne(Number(id));
    if (!report || !report.filePath) {
      throw new NotFoundException('PDF file not found');
    }
    const pdfPath = path.resolve(report.filePath);
    if (!fs.existsSync(pdfPath)) {
      throw new NotFoundException('PDF file not found on server');
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=report-${id}.pdf`,
    );
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  }
}
