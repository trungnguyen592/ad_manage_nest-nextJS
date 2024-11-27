import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAgeColumn1732698866602 implements MigrationInterface {
    name = 'AddAgeColumn1732698866602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "age" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "age"`);
    }

}
