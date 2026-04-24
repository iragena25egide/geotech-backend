import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { Report } from './report.entity';

@Entity('soil_samples')
export class SoilSample {
  @PrimaryGeneratedColumn()
  id: number;

  
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'll' })
  ll: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'pl' })
  pl: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'pi' })
  pi: number; // Plasticity Index (auto-calculated)

  // Grain Size Analysis
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'p200' })
  p200: number; // Percent passing #200 sieve (<0.075mm)

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'p4' })
  p4: number; // Percent passing #4 sieve (<4.75mm)

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'p40' })
  p40: number; // Percent passing #40 sieve (<0.425mm)

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'p10' })
  p10: number; // Percent passing #10 sieve (<2.00mm)

  // Particle Size Distribution
  @Column({ type: 'decimal', precision: 10, scale: 3, name: 'd60' })
  d60: number; // Particle size at 60% passing (mm)

  @Column({ type: 'decimal', precision: 10, scale: 3, name: 'd30' })
  d30: number; // Particle size at 30% passing (mm)

  @Column({ type: 'decimal', precision: 10, scale: 3, name: 'd10' })
  d10: number; // Particle size at 10% passing (mm)

  // Coefficients
  @Column({ type: 'decimal', precision: 10, scale: 3, name: 'cu' })
  cu: number; // Coefficient of Uniformity

  @Column({ type: 'decimal', precision: 10, scale: 3, name: 'cc' })
  cc: number; // Coefficient of Curvature

  // Classification
  @Column({ type: 'varchar', length: 10, name: 'symbol' })
  symbol: string; // USCS Symbol (e.g., CL, SW, MH)

  @Column({ type: 'varchar', length: 100, name: 'group_name' })
  groupName: string; // USCS Group Name

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'aashto_class' })
  aashtoClass: string; // AASHTO classification (optional)

  @Column({ type: 'text', nullable: true, name: 'color' })
  color: string; // Soil color (e.g., Brown, Gray)

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'sample_depth' })
  sampleDepth: string; // Depth where sample was taken

  @Column({ type: 'date', nullable: true, name: 'sampling_date' })
  samplingDate: Date;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  // Moisture and Density (optional fields)
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'natural_moisture',
  })
  naturalMoisture: number; // Natural moisture content (%)

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'dry_density',
  })
  dryDensity: number; // Dry density (g/cm³)

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'specific_gravity',
  })
  specificGravity: number; // Specific gravity

  // Foreign Key
  @Column({ type: 'int', name: 'project_id' })
  projectId: number;


  @ManyToOne(() => Project, (project) => project.soilSamples, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => Report, (report) => report.soilSample)
  reports: Report[];


  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
