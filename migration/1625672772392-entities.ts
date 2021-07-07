import {MigrationInterface, QueryRunner} from "typeorm";

export class entities1625672772392 implements MigrationInterface {
    name = 'entities1625672772392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "parking_slots_parkingtype_enum" AS ENUM('permit', 'reserved', 'visitor')`);
        await queryRunner.query(`CREATE TABLE "parking_slots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, "parkingType" "parking_slots_parkingtype_enum" NOT NULL DEFAULT 'permit', "isAvailable" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "residenceId" uuid NOT NULL, CONSTRAINT "PK_5250ec7083edc7c3491b72a0a50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "residences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), CONSTRAINT "PK_505bad416f6552d9481a82385bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parking_lots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "buildingId" uuid NOT NULL, CONSTRAINT "PK_27af37fbf2f9f525c1db6c20a48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "buildings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "residenceId" uuid NOT NULL, CONSTRAINT "PK_bc65c1acce268c383e41a69003a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('admin', 'manager', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(254) NOT NULL, "password" character varying(60) NOT NULL, "role" "users_role_enum" NOT NULL DEFAULT 'user', "refresh_token" character varying(512), "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "license" character varying(128) NOT NULL, "color" character varying(128) NOT NULL, "model" character varying(128) NOT NULL, "brand" character varying(128) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "driverId" character varying NOT NULL, CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "drivers " ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(128) NOT NULL, "lastName" character varying(128) NOT NULL, "isResident" boolean NOT NULL, "NID" character varying(128) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "userId" uuid NOT NULL, "vehicleId" character varying NOT NULL, CONSTRAINT "PK_18e3e72aca3c5c5307c4bccfb27" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles_driver_drivers " ("vehiclesId" uuid NOT NULL, "drivers_id" uuid NOT NULL, CONSTRAINT "PK_a7946ecc40df26fa63970a2eb81" PRIMARY KEY ("vehiclesId", "drivers_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f55826713703c88fc7215c4c7f" ON "vehicles_driver_drivers " ("vehiclesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_492d086aec007a9ca73ba2f2f9" ON "vehicles_driver_drivers " ("drivers_id") `);
        await queryRunner.query(`CREATE TABLE "drivers _vehicle_vehicles" ("drivers_id" uuid NOT NULL, "vehiclesId" uuid NOT NULL, CONSTRAINT "PK_3e29c0ccf00b3f85f191c5258c2" PRIMARY KEY ("drivers_id", "vehiclesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e2ce3a62e4d1a01993140cb80e" ON "drivers _vehicle_vehicles" ("drivers_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8052d81e02060606c717c79fce" ON "drivers _vehicle_vehicles" ("vehiclesId") `);
        await queryRunner.query(`ALTER TABLE "parking_slots" ADD CONSTRAINT "FK_c6e025883e2be778cac3f80839c" FOREIGN KEY ("residenceId") REFERENCES "residences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_lots" ADD CONSTRAINT "FK_e12bb1cb674205c38199124a400" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "buildings" ADD CONSTRAINT "FK_9996f406a974908b69c03970c05" FOREIGN KEY ("residenceId") REFERENCES "residences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "buildings" DROP CONSTRAINT "FK_9996f406a974908b69c03970c05"`);
        await queryRunner.query(`ALTER TABLE "parking_lots" DROP CONSTRAINT "FK_e12bb1cb674205c38199124a400"`);
        await queryRunner.query(`ALTER TABLE "parking_slots" DROP CONSTRAINT "FK_c6e025883e2be778cac3f80839c"`);
        await queryRunner.query(`DROP INDEX "IDX_8052d81e02060606c717c79fce"`);
        await queryRunner.query(`DROP INDEX "IDX_e2ce3a62e4d1a01993140cb80e"`);
        await queryRunner.query(`DROP TABLE "drivers _vehicle_vehicles"`);
        await queryRunner.query(`DROP INDEX "IDX_492d086aec007a9ca73ba2f2f9"`);
        await queryRunner.query(`DROP INDEX "IDX_f55826713703c88fc7215c4c7f"`);
        await queryRunner.query(`DROP TABLE "vehicles_driver_drivers "`);
        await queryRunner.query(`DROP TABLE "drivers "`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "users_role_enum"`);
        await queryRunner.query(`DROP TABLE "buildings"`);
        await queryRunner.query(`DROP TABLE "parking_lots"`);
        await queryRunner.query(`DROP TABLE "residences"`);
        await queryRunner.query(`DROP TABLE "parking_slots"`);
        await queryRunner.query(`DROP TYPE "parking_slots_parkingtype_enum"`);
    }

}
