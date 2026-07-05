import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_condition" AS ENUM('new', 'used', 'both');
  ALTER TABLE "products" ADD COLUMN "condition" "enum_products_condition" DEFAULT 'new';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "condition";
  DROP TYPE "public"."enum_products_condition";`)
}
