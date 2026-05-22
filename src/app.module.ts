import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { SoilModule } from './soil/soil.module';
import { ReportModule } from './report/report.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',

      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),

      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,

      database: process.env.DB_NAME,

      autoLoadEntities: true,

      synchronize: true,
    }),

    AuthModule,

    SoilModule,

    ProjectModule,

    ReportModule,
  ],
})
export class AppModule {}
