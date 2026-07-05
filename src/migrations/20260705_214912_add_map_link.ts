import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "store_name" SET DEFAULT 'THE GAMES OCEAN';
  ALTER TABLE "site_settings" ALTER COLUMN "contact_email" SET DEFAULT 'asifmohsin646@gmail.com';
  ALTER TABLE "site_settings" ALTER COLUMN "contact_phone" SET DEFAULT '+92 342 2904189';
  ALTER TABLE "site_settings" ALTER COLUMN "address" SET DEFAULT 'Shop # 11 Anaya Mobile Mall, Gurumandir, Karachi';
  ALTER TABLE "footer" ALTER COLUMN "bottom_text" SET DEFAULT '© The Games Ocean. All rights reserved.';
  ALTER TABLE "site_settings" ADD COLUMN "map_link" varchar DEFAULT 'https://maps.app.goo.gl/ZcYeKxXeASD8wkew8';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "store_name" SET DEFAULT 'NEXORA';
  ALTER TABLE "site_settings" ALTER COLUMN "contact_email" SET DEFAULT 'support@nexora.gg';
  ALTER TABLE "site_settings" ALTER COLUMN "contact_phone" SET DEFAULT '+92 300 1234567';
  ALTER TABLE "site_settings" ALTER COLUMN "address" SET DEFAULT 'Gulberg III, Lahore, Pakistan';
  ALTER TABLE "footer" ALTER COLUMN "bottom_text" SET DEFAULT '© NEXORA. All rights reserved.';
  ALTER TABLE "site_settings" DROP COLUMN "map_link";`)
}
