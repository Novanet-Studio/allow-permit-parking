import {MigrationInterface, QueryRunner} from "typeorm";

export class updateParkingLot1624660133284 implements MigrationInterface {
    name = 'updateParkingLot1624660133284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_lots" ADD "buildingIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "parking_lots" ADD CONSTRAINT "FK_bd148975b35b9b2006a02285b95" FOREIGN KEY ("buildingIdId") REFERENCES "buildings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_lots" DROP CONSTRAINT "FK_bd148975b35b9b2006a02285b95"`);
        await queryRunner.query(`ALTER TABLE "parking_lots" DROP COLUMN "buildingIdId"`);
    }

}
