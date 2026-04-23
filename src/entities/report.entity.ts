import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { SoilSample } from './soil.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'report_type',
    default: 'soil_analysis',
  })
  reportType: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'file_path' })
  filePath: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'file_url' })
  fileUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  content: {
    summary?: string;
    conclusions?: string[];
    recommendations?: string[];
    soilProperties?: Record<string, any>;
    testResults?: Record<string, any>;
    charts?: Array<{ title: string; data: any }>;
  };

  @Column({ type: 'jsonb', nullable: true, name: 'statistics' })
  statistics: {
    totalSamples?: number;
    averageLL?: number;
    averagePL?: number;
    averagePI?: number;
    classificationSummary?: Record<string, number>;
    minValues?: Record<string, number>;
    maxValues?: Record<string, number>;
  };

  @Column({ type: 'varchar', length: 50, default: 'draft' })
  status: string; // draft, generated, approved, archived

  @Column({ type: 'timestamp', nullable: true, name: 'generated_at' })
  generatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'approved_at' })
  approvedAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'approved_by' })
  approvedBy: string;

  @Column({ type: 'text', nullable: true, name: 'review_comments' })
  reviewComments: string;

  @Column({ type: 'int', nullable: true, name: 'report_version', default: 1 })
  reportVersion: number;

  // Foreign Keys
  @Column({ type: 'int', name: 'project_id' })
  projectId: number;

  @Column({ type: 'int', nullable: true, name: 'soil_sample_id' })
  soilSampleId: number;

  @ManyToOne(() => Project, (project) => project.reports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => SoilSample, (soilSample) => soilSample.reports, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'soil_sample_id' })
  soilSample: SoilSample;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
