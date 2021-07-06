import {MigrationInterface, QueryRunner} from "typeorm";

export class entitiesRefactor1625609173781 implements MigrationInterface {
    name = 'entitiesRefactor1625609173781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers " DROP CONSTRAINT "FK_2e6e175280267f5b7ee0939d079"`);
        await queryRunner.query(`CREATE TABLE "vehicles_driver_drivers " ("vehiclesId" uuid NOT NULL, "drivers_id" uuid NOT NULL, CONSTRAINT "PK_a7946ecc40df26fa63970a2eb81" PRIMARY KEY ("vehiclesId", "drivers_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f55826713703c88fc7215c4c7f" ON "vehicles_driver_drivers " ("vehiclesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_492d086aec007a9ca73ba2f2f9" ON "vehicles_driver_drivers " ("drivers_id") `);
        await queryRunner.query(`CREATE TABLE "drivers _vehicle_vehicles" ("drivers_id" uuid NOT NULL, "vehiclesId" uuid NOT NULL, CONSTRAINT "PK_3e29c0ccf00b3f85f191c5258c2" PRIMARY KEY ("drivers_id", "vehiclesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e2ce3a62e4d1a01993140cb80e" ON "drivers _vehicle_vehicles" ("drivers_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8052d81e02060606c717c79fce" ON "drivers _vehicle_vehicles" ("vehiclesId") `);
        await queryRunner.query(`ALTER TABLE "drivers " DROP COLUMN "userIdId"`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "driverId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drivers " ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drivers " ADD "vehicleId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drivers " ADD CONSTRAINT "FK_57733ca1933031f4eec40fb1591" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicles_driver_drivers " ADD CONSTRAINT "FK_f55826713703c88fc7215c4c7fb" FOREIGN KEY ("vehiclesId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicles_driver_drivers " ADD CONSTRAINT "FK_492d086aec007a9ca73ba2f2f9f" FOREIGN KEY ("drivers_id") REFERENCES "drivers "("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers _vehicle_vehicles" ADD CONSTRAINT "FK_e2ce3a62e4d1a01993140cb80e9" FOREIGN KEY ("drivers_id") REFERENCES "drivers "("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers _vehicle_vehicles" ADD CONSTRAINT "FK_8052d81e02060606c717c79fce5" FOREIGN KEY ("vehiclesId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers _vehicle_vehicles" DROP CONSTRAINT "FK_8052d81e02060606c717c79fce5"`);
        await queryRunner.query(`ALTER TABLE "drivers _vehicle_vehicles" DROP CONSTRAINT "FK_e2ce3a62e4d1a01993140cb80e9"`);
        await queryRunner.query(`ALTER TABLE "vehicles_driver_drivers " DROP CONSTRAINT "FK_492d086aec007a9ca73ba2f2f9f"`);
        await queryRunner.query(`ALTER TABLE "vehicles_driver_drivers " DROP CONSTRAINT "FK_f55826713703c88fc7215c4c7fb"`);
        await queryRunner.query(`ALTER TABLE "drivers " DROP CONSTRAINT "FK_57733ca1933031f4eec40fb1591"`);
        await queryRunner.query(`ALTER TABLE "drivers " DROP COLUMN "vehicleId"`);
        await queryRunner.query(`ALTER TABLE "drivers " DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "driverId"`);
        await queryRunner.query(`ALTER TABLE "drivers " ADD "userIdId" uuid`);
        await queryRunner.query(`DROP INDEX "IDX_8052d81e02060606c717c79fce"`);
        await queryRunner.query(`DROP INDEX "IDX_e2ce3a62e4d1a01993140cb80e"`);
        await queryRunner.query(`DROP TABLE "drivers _vehicle_vehicles"`);
        await queryRunner.query(`DROP INDEX "IDX_492d086aec007a9ca73ba2f2f9"`);
        await queryRunner.query(`DROP INDEX "IDX_f55826713703c88fc7215c4c7f"`);
        await queryRunner.query(`DROP TABLE "vehicles_driver_drivers "`);
        await queryRunner.query(`ALTER TABLE "drivers " ADD CONSTRAINT "FK_2e6e175280267f5b7ee0939d079" FOREIGN KEY ("userIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
