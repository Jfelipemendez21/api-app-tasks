import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1722600000000 implements MigrationInterface {
  name = 'InitialSchema1722600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Enum Types
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'regular')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."projects_status_enum" AS ENUM('created', 'in_progress', 'finished', 'canceled')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_priority_enum" AS ENUM('low', 'medium', 'high')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum" AS ENUM('created', 'in_progress', 'finished', 'canceled')`
    );

    // Create Users Table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "nickname" character varying NOT NULL,
        "name" character varying NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'regular',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create Projects Table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying NOT NULL,
        "description" text,
        "status" "public"."projects_status_enum" NOT NULL DEFAULT 'created',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_projects_id" PRIMARY KEY ("id")
      )
    `);

    // Create Tasks Table
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying NOT NULL,
        "description" text,
        "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'medium',
        "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'created',
        "initialDateTime" TIMESTAMP,
        "finishedDateTime" TIMESTAMP,
        "assignedToId" uuid,
        "createdById" uuid NOT NULL,
        "projectId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tasks_assignedTo" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_tasks_createdBy" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_tasks_project" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
    await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
