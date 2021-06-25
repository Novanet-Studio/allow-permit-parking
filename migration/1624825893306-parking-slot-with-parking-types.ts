import {MigrationInterface, QueryRunner} from "typeorm";

export class parkingSlotWithParkingTypes1624825893306 implements MigrationInterface {
    name = 'parkingSlotWithParkingTypes1624825893306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "parking_slots_parkingtype_enum" AS ENUM('permit', 'reserved', 'visitor')`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ADD "parkingType" "parking_slots_parkingtype_enum" NOT NULL DEFAULT 'permit'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parking_slots" DROP COLUMN "parkingType"`);
        await queryRunner.query(`DROP TYPE "parking_slots_parkingtype_enum"`);
    }

}
