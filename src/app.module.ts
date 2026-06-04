import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { SoilModule } from './soil/soil.module';
import { ReportModule } from './report/report.module';
import { ProjectModule } from './project/project.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,

      autoLoadEntities: true,

      synchronize: true,
    }),

    AuthModule,

    SoilModule,

    ProjectModule,

    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
