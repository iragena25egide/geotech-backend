import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateSoilSampleDto {
  @IsNumber() ll: number;
  @IsNumber() pl: number;
  @IsNumber() pi: number;
  @IsNumber() p200: number;
  @IsNumber() p4: number;
  @IsNumber() p40: number;
  @IsNumber() p10: number;
  @IsNumber() d60: number;
  @IsNumber() d30: number;
  @IsNumber() d10: number;
  @IsNumber() cu: number;
  @IsNumber() cc: number;
  @IsString() symbol: string;
  @IsString() groupName: string;
  @IsString() @IsOptional() aashtoClass?: string;
  @IsString() @IsOptional() color?: string;
  @IsString() @IsOptional() sampleDepth?: string;
  @IsDateString() @IsOptional() samplingDate?: Date;
  @IsString() @IsOptional() remarks?: string;
  @IsNumber() @IsOptional() naturalMoisture?: number;
  @IsNumber() @IsOptional() dryDensity?: number;
  @IsNumber() @IsOptional() specificGravity?: number;
  @IsNumber() projectId: number;
}

export class UpdateSoilSampleDto extends CreateSoilSampleDto {}
