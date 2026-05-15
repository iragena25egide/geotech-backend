import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778874249806 implements MigrationInterface {
    name = 'Init1778874249806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reports" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" text, "report_type" character varying(50) NOT NULL DEFAULT 'soil_analysis', "file_path" character varying(255), "file_url" character varying(255), "content" jsonb, "statistics" jsonb, "status" character varying(50) NOT NULL DEFAULT 'draft', "generated_at" TIMESTAMP, "approved_at" TIMESTAMP, "approved_by" character varying(100), "review_comments" text, "report_version" integer DEFAULT '1', "project_id" integer NOT NULL, "soil_sample_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "location" character varying(255), "client" character varying(100), "engineer" character varying(100), "startDate" date, "endDate" date, "budget" numeric(10,2), "status" character varying(50) NOT NULL DEFAULT 'active', "isActive" boolean NOT NULL DEFAULT true, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "soil_samples" ("id" SERIAL NOT NULL, "ll" numeric(10,2) NOT NULL, "pl" numeric(10,2) NOT NULL, "pi" numeric(10,2) NOT NULL, "p200" numeric(10,2) NOT NULL, "p4" numeric(10,2) NOT NULL, "p40" numeric(10,2) NOT NULL, "p10" numeric(10,2) NOT NULL, "d60" numeric(10,3) NOT NULL, "d30" numeric(10,3) NOT NULL, "d10" numeric(10,3) NOT NULL, "cu" numeric(10,3) NOT NULL, "cc" numeric(10,3) NOT NULL, "symbol" character varying(10) NOT NULL, "group_name" character varying(100) NOT NULL, "aashto_class" character varying(50), "color" text, "sample_depth" character varying(50), "sampling_date" date, "remarks" text, "natural_moisture" numeric(10,2), "dry_density" numeric(10,2), "specific_gravity" numeric(10,2), "project_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_553335b22543e8466dad73fc576" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_bbe3b065e71d60f9d51ad236225" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_e05548769a15422f089a39910f1" FOREIGN KEY ("soil_sample_id") REFERENCES "soil_samples"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "soil_samples" ADD CONSTRAINT "FK_37e7a16f713f446177a0ecde999" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soil_samples" DROP CONSTRAINT "FK_37e7a16f713f446177a0ecde999"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_e05548769a15422f089a39910f1"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_bbe3b065e71d60f9d51ad236225"`);
        await queryRunner.query(`DROP TABLE "soil_samples"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "reports"`);
    }

}
