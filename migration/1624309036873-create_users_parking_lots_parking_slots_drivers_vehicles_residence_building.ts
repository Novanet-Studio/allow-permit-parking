import {MigrationInterface, QueryRunner} from "typeorm";

export class createUsersParkingLotsParkingSlotsDriversVehiclesResidenceBuilding1624309036873 implements MigrationInterface {
    name = 'createUsersParkingLotsParkingSlotsDriversVehiclesResidenceBuilding1624309036873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "buildings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "residenceIdId" uuid, CONSTRAINT "PK_bc65c1acce268c383e41a69003a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "buildings" ADD CONSTRAINT "FK_208e8d92fd50b2376553c81b942" FOREIGN KEY ("residenceIdId") REFERENCES "residences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buildings" DROP CONSTRAINT "FK_208e8d92fd50b2376553c81b942"`);
        await queryRunner.query(`DROP TABLE "buildings"`);
    }

}
