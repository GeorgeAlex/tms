import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApiKeyEntity1746301091202 implements MigrationInterface {
    name = 'AddApiKeyEntity1746301091202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "api_key" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "key" character varying NOT NULL,
                CONSTRAINT "UQ_fb080786c16de6ace7ed0b69f7d" UNIQUE ("key"),
                CONSTRAINT "PK_b1bd840641b8acbaad89c3d8d11" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "api_key"."createdAt" IS 'Creation date';
            COMMENT ON COLUMN "api_key"."updatedAt" IS 'Latest update date'
        `);

        // Seed an initial API key
        await queryRunner.query(`
            INSERT INTO "api_key" ("key")
            VALUES ('dev_api_key_123')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "api_key"
        `);
    }

}
