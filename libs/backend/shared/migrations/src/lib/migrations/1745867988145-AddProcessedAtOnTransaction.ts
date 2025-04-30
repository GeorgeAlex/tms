import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProcessedAtOnTransaction1745867988145 implements MigrationInterface {
    name = 'AddProcessedAtOnTransaction1745867988145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"
            ADD "processed_at" TIMESTAMP WITH TIME ZONE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction" DROP COLUMN "processed_at"
        `);
    }

}
