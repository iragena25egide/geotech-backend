import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsObject,
} from 'class-validator';

export class CreateReportDto {
  @IsString() title: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() reportType?: string;
  @IsString() @IsOptional() filePath?: string;
  @IsString() @IsOptional() fileUrl?: string;
  @IsObject() @IsOptional() content?: any;
  @IsObject() @IsOptional() statistics?: any;
  @IsString() @IsOptional() status?: string;
  @IsDateString() @IsOptional() generatedAt?: Date;
  @IsDateString() @IsOptional() approvedAt?: Date;
  @IsString() @IsOptional() approvedBy?: string;
  @IsString() @IsOptional() reviewComments?: string;
  @IsNumber() @IsOptional() reportVersion?: number;
  @IsNumber() projectId: number;
  @IsNumber() @IsOptional() soilSampleId?: number;
}

export class UpdateReportDto extends CreateReportDto {}
