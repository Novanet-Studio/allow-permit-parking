import {MigrationInterface, QueryRunner} from "typeorm";

export class residenceBuildingsUniqueNames1625699453985 implements MigrationInterface {
    name = 'residenceBuildingsUniqueNames1625699453985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "residences" ADD CONSTRAINT "UQ_0768049b9ad6894749e24a68105" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "buildings" ADD CONSTRAINT "UQ_3f5a7e0aabca27edc3806fdb298" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buildings" DROP CONSTRAINT "UQ_3f5a7e0aabca27edc3806fdb298"`);
        await queryRunner.query(`ALTER TABLE "residences" DROP CONSTRAINT "UQ_0768049b9ad6894749e24a68105"`);
    }

}
