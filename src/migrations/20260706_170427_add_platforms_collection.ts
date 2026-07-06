import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "platforms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "categories" ADD COLUMN "platform_id" integer;
  ALTER TABLE "products" ADD COLUMN "platform_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "platforms_id" integer;
  DELETE FROM "home_page_platform_section_cards";
  ALTER TABLE "home_page_platform_section_cards" ADD COLUMN "platform_id" integer NOT NULL;
  CREATE UNIQUE INDEX "platforms_slug_idx" ON "platforms" USING btree ("slug");
  CREATE INDEX "platforms_updated_at_idx" ON "platforms" USING btree ("updated_at");
  CREATE INDEX "platforms_created_at_idx" ON "platforms" USING btree ("created_at");
  ALTER TABLE "categories" ADD CONSTRAINT "categories_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_platforms_fk" FOREIGN KEY ("platforms_id") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_platform_section_cards" ADD CONSTRAINT "home_page_platform_section_cards_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "categories_platform_idx" ON "categories" USING btree ("platform_id");
  CREATE INDEX "products_platform_idx" ON "products" USING btree ("platform_id");
  CREATE INDEX "payload_locked_documents_rels_platforms_id_idx" ON "payload_locked_documents_rels" USING btree ("platforms_id");
  CREATE INDEX "home_page_platform_section_cards_platform_idx" ON "home_page_platform_section_cards" USING btree ("platform_id");
  ALTER TABLE "categories" DROP COLUMN "platform";
  ALTER TABLE "products" DROP COLUMN "platform";
  ALTER TABLE "home_page_platform_section_cards" DROP COLUMN "platform";
  DROP TYPE "public"."enum_categories_platform";
  DROP TYPE "public"."enum_products_platform";
  DROP TYPE "public"."enum_home_page_platform_section_cards_platform";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_categories_platform" AS ENUM('playstation', 'xbox', 'switch', 'pc', 'universal');
  CREATE TYPE "public"."enum_products_platform" AS ENUM('playstation', 'xbox', 'switch', 'pc', 'universal');
  CREATE TYPE "public"."enum_home_page_platform_section_cards_platform" AS ENUM('playstation', 'xbox', 'switch', 'pc', 'universal');
  ALTER TABLE "platforms" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "platforms" CASCADE;
  ALTER TABLE "categories" DROP CONSTRAINT "categories_platform_id_platforms_id_fk";
  
  ALTER TABLE "products" DROP CONSTRAINT "products_platform_id_platforms_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_platforms_fk";
  
  ALTER TABLE "home_page_platform_section_cards" DROP CONSTRAINT "home_page_platform_section_cards_platform_id_platforms_id_fk";
  
  DROP INDEX "categories_platform_idx";
  DROP INDEX "products_platform_idx";
  DROP INDEX "payload_locked_documents_rels_platforms_id_idx";
  DROP INDEX "home_page_platform_section_cards_platform_idx";
  ALTER TABLE "categories" ADD COLUMN "platform" "enum_categories_platform";
  ALTER TABLE "products" ADD COLUMN "platform" "enum_products_platform";
  ALTER TABLE "home_page_platform_section_cards" ADD COLUMN "platform" "enum_home_page_platform_section_cards_platform" NOT NULL;
  ALTER TABLE "categories" DROP COLUMN "platform_id";
  ALTER TABLE "products" DROP COLUMN "platform_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "platforms_id";
  ALTER TABLE "home_page_platform_section_cards" DROP COLUMN "platform_id";`)
}
