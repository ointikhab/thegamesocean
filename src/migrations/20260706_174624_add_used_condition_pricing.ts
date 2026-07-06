import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_variants_condition" AS ENUM('new', 'used');
  ALTER TABLE "products_variants" ADD COLUMN "condition" "enum_products_variants_condition";
  ALTER TABLE "products" ADD COLUMN "used_price" numeric;
  ALTER TABLE "products" ADD COLUMN "used_compare_at_price" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_variants" DROP COLUMN "condition";
  ALTER TABLE "products" DROP COLUMN "used_price";
  ALTER TABLE "products" DROP COLUMN "used_compare_at_price";
  DROP TYPE "public"."enum_products_variants_condition";`)
}
