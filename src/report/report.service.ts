import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(data: Partial<Report>): Promise<Report> {
    // 1. Create the report entity
    const report = this.reportRepository.create(data);

    // 2. Generate PDF and save to disk
    const reportsDir = path.resolve(__dirname, '../../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const fileName = `report-${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    await this.generatePdf(report, filePath);

    // 3. Save file path in the report entity
    (report as any).filePath = filePath; // Add filePath property if not in entity

    // 4. Save report to DB
    return this.reportRepository.save(report);
  }

  async generatePdf(report: Partial<Report>, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(20).text('Geotechnical Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Status: ${report.status || 'N/A'}`);
      doc.moveDown();
      doc.text(`Summary: ${report.content?.summary || 'No summary'}`);
      doc.moveDown();
      doc.text(
        `Conclusions: ${(report.content?.conclusions || []).join(', ')}`,
      );
      doc.moveDown();
      doc.text(
        `Recommendations: ${(report.content?.recommendations || []).join(', ')}`,
      );

      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }

  async findAll(): Promise<Report[]> {
    return this.reportRepository.find();
  }

  async findOne(id: number): Promise<Report | null> {
    return this.reportRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Report>): Promise<Report | null> {
    await this.reportRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.reportRepository.delete(id);
  }
}
