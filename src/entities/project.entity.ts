import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SoilSample } from './soil.entity';
import { Report } from './report.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  client: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  engineer: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string; // active, completed, on-hold, cancelled

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    projectType?: string;
    priority?: string;
    tags?: string[];
    customFields?: Record<string, any>;
  };

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => SoilSample, (soilSample) => soilSample.project, {
    cascade: true,
    eager: false,
  })
  soilSamples: SoilSample[];

  @OneToMany(() => Report, (report) => report.project, {
    cascade: true,
    eager: false,
  })
  reports: Report[];
}
