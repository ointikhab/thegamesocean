import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_orders_payment_method" ADD VALUE 'easypaisa';
  ALTER TYPE "public"."enum_orders_payment_method" ADD VALUE 'meezan_bank';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ALTER COLUMN "payment_method" SET DATA TYPE text;
  ALTER TABLE "orders" ALTER COLUMN "payment_method" SET DEFAULT 'cod'::text;
  DROP TYPE "public"."enum_orders_payment_method";
  CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('cod');
  ALTER TABLE "orders" ALTER COLUMN "payment_method" SET DEFAULT 'cod'::"public"."enum_orders_payment_method";
  ALTER TABLE "orders" ALTER COLUMN "payment_method" SET DATA TYPE "public"."enum_orders_payment_method" USING "payment_method"::"public"."enum_orders_payment_method";`)
}
