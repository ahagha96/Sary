import {MigrationInterface, QueryRunner} from "typeorm";

export class initTables1653104454342 implements MigrationInterface {
    name = 'initTables1653104454342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "t_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "number" character varying NOT NULL, "number_of_seats" numeric(10,0) NOT NULL, CONSTRAINT "UQ_661cdc81475209086c099d74845" UNIQUE ("number"), CONSTRAINT "PK_874914a7a339bcdc63296abf098" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_reservation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "date" date NOT NULL, "table_id" uuid, CONSTRAINT "PK_bcf99d7383b51142d56c7672ded" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."t_user_role_enum" AS ENUM('ADMIN', 'EMPLOYEE')`);
        await queryRunner.query(`CREATE TABLE "t_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "employee_number" character varying(4) NOT NULL, "name" character varying(50) NOT NULL, "password" character varying NOT NULL, "role" "public"."t_user_role_enum" NOT NULL DEFAULT 'EMPLOYEE', CONSTRAINT "UQ_b2ff8288e40619a02bc11aa046a" UNIQUE ("employee_number"), CONSTRAINT "PK_6a6708d647ac5da9ab8271cfede" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_employee_number" ON "t_user" ("employee_number") `);
        await queryRunner.query(`ALTER TABLE "t_reservation" ADD CONSTRAINT "FK_7c1914b333956cc072031196c60" FOREIGN KEY ("table_id") REFERENCES "t_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_reservation" DROP CONSTRAINT "FK_7c1914b333956cc072031196c60"`);
        await queryRunner.query(`DROP INDEX "public"."idx_employee_number"`);
        await queryRunner.query(`DROP TABLE "t_user"`);
        await queryRunner.query(`DROP TYPE "public"."t_user_role_enum"`);
        await queryRunner.query(`DROP TABLE "t_reservation"`);
        await queryRunner.query(`DROP TABLE "t_table"`);
    }

}
