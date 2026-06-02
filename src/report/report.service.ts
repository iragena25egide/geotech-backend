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
    const report = this.reportRepository.create(data);

    const reportsDir = path.resolve(__dirname, '../../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const fileName = `report-${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    await this.generatePdf(report, filePath);

    report.filePath = filePath;
    report.fileUrl = `/reports/download/${fileName}`;
    report.generatedAt = new Date();

    return this.reportRepository.save(report);
  }

  async generatePdf(report: Partial<Report>, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // --- COLOR PALETTE ---
      const primaryColor = '#0f3460';
      const secondaryColor = '#16213e';
      const accentColor = '#e94560';
      const neutralLight = '#f4f6f9';
      const textColor = '#333333';
      const borderLineColor = '#cccccc';

      // --- HEADER ---
      doc.rect(0, 0, 595.28, 120).fill(primaryColor);
      doc.fillColor('#ffffff');
      doc
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('GEOTECHNICAL LABORATORY REPORT', 50, 40);
      doc
        .fontSize(10)
        .font('Helvetica')
        .text('GeoTech Soil Analysis Platform — Automated Engine', 50, 70);

      // --- DOCUMENT INFO METADATA ---
      doc.fillColor(textColor);
      doc.y = 145;
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('REPORT INFORMATION', 50, doc.y);
      doc.moveDown(0.5);

      const startY = doc.y;
      doc.fontSize(10).font('Helvetica-Bold').text('Report Title:', 50, startY);
      doc
        .font('Helvetica')
        .text(report.title || 'Soil Characterization Report', 140, startY);

      doc.font('Helvetica-Bold').text('Status:', 50, startY + 16);
      doc
        .font('Helvetica')
        .text((report.status || 'draft').toUpperCase(), 140, startY + 16);

      doc.font('Helvetica-Bold').text('Date Generated:', 320, startY);
      doc.font('Helvetica').text(new Date().toLocaleString(), 420, startY);

      doc.font('Helvetica-Bold').text('Version:', 320, startY + 16);
      doc
        .font('Helvetica')
        .text(`v${report.reportVersion || 1}.0`, 420, startY + 16);

      doc.moveDown(2.5);
      doc
        .strokeColor(borderLineColor)
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();
      doc.moveDown(1.5);

      // --- EXECUTIVE SUMMARY ---
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('1. EXECUTIVE SUMMARY', 50, doc.y);
      doc.moveDown(0.5);
      doc
        .fontSize(9.5)
        .font('Helvetica')
        .fillColor('#555555')
        .text(
          report.content?.summary ||
            'This report documents the laboratory test results for soil classification according to the Unified Soil Classification System (USCS). Laboratory results outline the plasticity characteristics (Atterberg Limits) and grain size distribution metrics representing critical properties for foundation, roadway, and general structural engineering design.',
          {
            width: 495,
            align: 'justify',
            lineGap: 4,
          },
        );
      doc.moveDown(1.5);

      // --- LABORATORY STATISTICS & METRICS ---
      if (report.statistics) {
        const stats = report.statistics;
        doc.fillColor(textColor);
        doc
          .fontSize(13)
          .font('Helvetica-Bold')
          .text('2. ANALYSIS STATISTICS', 50, doc.y);
        doc.moveDown(0.5);

        const statsY = doc.y;
        doc.rect(50, statsY, 150, 50).fill(neutralLight);
        doc.rect(222, statsY, 150, 50).fill(neutralLight);
        doc.rect(395, statsY, 150, 50).fill(neutralLight);

        doc.fillColor(textColor);
        doc
          .fontSize(8.5)
          .font('Helvetica-Bold')
          .text('TOTAL SOIL SAMPLES', 55, statsY + 8, {
            width: 140,
            align: 'center',
          });
        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .fillColor(primaryColor)
          .text(`${stats.totalSamples || 0}`, 55, statsY + 24, {
            width: 140,
            align: 'center',
          });

        doc.fillColor(textColor);
        doc
          .fontSize(8.5)
          .font('Helvetica-Bold')
          .text('AVERAGE LIQUID LIMIT', 227, statsY + 8, {
            width: 140,
            align: 'center',
          });
        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .fillColor(primaryColor)
          .text(
            `${stats.averageLL ? Number(stats.averageLL).toFixed(1) : 'N/A'}%`,
            227,
            statsY + 24,
            { width: 140, align: 'center' },
          );

        doc.fillColor(textColor);
        doc
          .fontSize(8.5)
          .font('Helvetica-Bold')
          .text('AVERAGE PLASTICITY INDEX', 400, statsY + 8, {
            width: 140,
            align: 'center',
          });
        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .fillColor(primaryColor)
          .text(
            `${stats.averagePI ? Number(stats.averagePI).toFixed(1) : 'N/A'}%`,
            400,
            statsY + 24,
            { width: 140, align: 'center' },
          );

        doc.y = statsY + 70;
      }

      // --- RECOMMENDATIONS & CONCLUSIONS ---
      doc.fillColor(textColor);
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('3. ENGINEERING CONCLUSIONS', 50, doc.y);
      doc.moveDown(0.5);

      const conclusionsList = report.content?.conclusions || [
        'Atterberg limits demonstrate that the clayey soils present moderate plasticity and medium compressibility.',
        'Sandy soils represent stable structural subgrade properties, characterized by lower water-holding potential.',
        'Moisture density relationships should be established prior to subgrade compaction work.',
      ];

      conclusionsList.forEach((conclusion, index) => {
        doc
          .fontSize(9.5)
          .font('Helvetica-Bold')
          .text(`${index + 1}.`, 50, doc.y);
        doc.font('Helvetica').text(conclusion, 65, doc.y - 11, { width: 480 });
        doc.moveDown(0.3);
      });

      doc.moveDown(1.5);
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('4. GEOTECHNICAL RECOMMENDATIONS', 50, doc.y);
      doc.moveDown(0.5);

      const recList = report.content?.recommendations || [
        'Clay soils plotting as CL/CH require proper moisture control during compaction to minimize swelling pressure.',
        'Proper surface drainage should be provided to maintain optimal soil bearing capacities.',
        'Additional in-situ standard penetration tests (SPT) are recommended for heavy foundation designs.',
      ];

      recList.forEach((rec, index) => {
        doc
          .fontSize(9.5)
          .font('Helvetica-Bold')
          .fillColor(accentColor)
          .text('•', 50, doc.y);
        doc
          .font('Helvetica')
          .fillColor(textColor)
          .text(rec, 65, doc.y - 11, { width: 480 });
        doc.moveDown(0.3);
      });

      // --- SIGNATURE SECTION ---
      doc.moveDown(2.5);
      const sigY = doc.y;

      doc
        .strokeColor(borderLineColor)
        .lineWidth(1)
        .moveTo(50, sigY)
        .lineTo(200, sigY)
        .stroke();
      doc
        .strokeColor(borderLineColor)
        .lineWidth(1)
        .moveTo(395, sigY)
        .lineTo(545, sigY)
        .stroke();

      doc
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .text('PREPARED BY', 50, sigY + 6, { width: 150, align: 'center' });
      doc.font('Helvetica').text('Laboratory Specialist', 50, sigY + 18, {
        width: 150,
        align: 'center',
      });

      doc
        .font('Helvetica-Bold')
        .text('APPROVED BY', 395, sigY + 6, { width: 150, align: 'center' });
      doc
        .font('Helvetica')
        .text(
          report.approvedBy || 'Senior Geotechnical Engineer',
          395,
          sigY + 18,
          { width: 150, align: 'center' },
        );

      // Page footer
      doc
        .fontSize(8)
        .fillColor('#777777')
        .text(
          'Confidential Document — GeoTech Laboratory Testing Services',
          50,
          doc.page.height - 40,
          { width: 495, align: 'center' },
        );

      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }

  async findAll(): Promise<Report[]> {
    return this.reportRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findByProject(projectId: number): Promise<Report[]> {
    return this.reportRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });
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
