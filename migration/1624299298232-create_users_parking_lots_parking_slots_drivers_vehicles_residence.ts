import {MigrationInterface, QueryRunner} from "typeorm";

export class createUsersParkingLotsParkingSlotsDriversVehiclesResidence1624299298232 implements MigrationInterface {
    name = 'createUsersParkingLotsParkingSlotsDriversVehiclesResidence1624299298232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "license" character varying(128) NOT NULL, "color" character varying(128) NOT NULL, "model" character varying(128) NOT NULL, "brand" character varying(128) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "drivers " ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(128) NOT NULL, "lastName" character varying(128) NOT NULL, "isResident" boolean NOT NULL, "NID" character varying(128) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "userIdId" uuid, CONSTRAINT "PK_18e3e72aca3c5c5307c4bccfb27" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parking_slots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "parkingLotIdId" uuid, CONSTRAINT "PK_5250ec7083edc7c3491b72a0a50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parking_lots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), CONSTRAINT "PK_27af37fbf2f9f525c1db6c20a48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "residences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), CONSTRAINT "PK_505bad416f6552d9481a82385bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles_driver_id_drivers " ("vehiclesId" uuid NOT NULL, "drivers_id" uuid NOT NULL, CONSTRAINT "PK_c7dda8aa2feb70c15ed41f93e35" PRIMARY KEY ("vehiclesId", "drivers_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2d66c673e04b921fa6331565ff" ON "vehicles_driver_id_drivers " ("vehiclesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1a157ac8dcef27135b714df018" ON "vehicles_driver_id_drivers " ("drivers_id") `);
        await queryRunner.query(`CREATE TABLE "drivers _vehicle_id_vehicles" ("drivers_id" uuid NOT NULL, "vehiclesId" uuid NOT NULL, CONSTRAINT "PK_8ebe9736374050e978407eebde1" PRIMARY KEY ("drivers_id", "vehiclesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f65d786101612cd4568e36116" ON "drivers _vehicle_id_vehicles" ("drivers_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c59a3a61a64cc302ce8ad652e3" ON "drivers _vehicle_id_vehicles" ("vehiclesId") `);
        await queryRunner.query(`ALTER TABLE "drivers " ADD CONSTRAINT "FK_2e6e175280267f5b7ee0939d079" FOREIGN KEY ("userIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_slots" ADD CONSTRAINT "FK_2de7e435a4b42e28acf9590eb6c" FOREIGN KEY ("parkingLotIdId") REFERENCES "parking_lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicles_driver_id_drivers " ADD CONSTRAINT "FK_2d66c673e04b921fa6331565ffb" FOREIGN KEY ("vehiclesId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicles_driver_id_drivers " ADD CONSTRAINT "FK_1a157ac8dcef27135b714df018d" FOREIGN KEY ("drivers_id") REFERENCES "drivers "("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers _vehicle_id_vehicles" ADD CONSTRAINT "FK_5f65d786101612cd4568e36116f" FOREIGN KEY ("drivers_id") REFERENCES "drivers "("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers _vehicle_id_vehicles" ADD CONSTRAINT "FK_c59a3a61a64cc302ce8ad652e31" FOREIGN KEY ("vehiclesId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers _vehicle_id_vehicles" DROP CONSTRAINT "FK_c59a3a61a64cc302ce8ad652e31"`);
        await queryRunner.query(`ALTER TABLE "drivers _vehicle_id_vehicles" DROP CONSTRAINT "FK_5f65d786101612cd4568e36116f"`);
        await queryRunner.query(`ALTER TABLE "vehicles_driver_id_drivers " DROP CONSTRAINT "FK_1a157ac8dcef27135b714df018d"`);
        await queryRunner.query(`ALTER TABLE "vehicles_driver_id_drivers " DROP CONSTRAINT "FK_2d66c673e04b921fa6331565ffb"`);
        await queryRunner.query(`ALTER TABLE "parking_slots" DROP CONSTRAINT "FK_2de7e435a4b42e28acf9590eb6c"`);
        await queryRunner.query(`ALTER TABLE "drivers " DROP CONSTRAINT "FK_2e6e175280267f5b7ee0939d079"`);
        await queryRunner.query(`DROP INDEX "IDX_c59a3a61a64cc302ce8ad652e3"`);
        await queryRunner.query(`DROP INDEX "IDX_5f65d786101612cd4568e36116"`);
        await queryRunner.query(`DROP TABLE "drivers _vehicle_id_vehicles"`);
        await queryRunner.query(`DROP INDEX "IDX_1a157ac8dcef27135b714df018"`);
        await queryRunner.query(`DROP INDEX "IDX_2d66c673e04b921fa6331565ff"`);
        await queryRunner.query(`DROP TABLE "vehicles_driver_id_drivers "`);
        await queryRunner.query(`DROP TABLE "residences"`);
        await queryRunner.query(`DROP TABLE "parking_lots"`);
        await queryRunner.query(`DROP TABLE "parking_slots"`);
        await queryRunner.query(`DROP TABLE "drivers "`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
    }

}
