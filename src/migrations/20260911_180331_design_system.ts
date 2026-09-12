import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_trust_strip_source" AS ENUM('settings', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_two_column_background" AS ENUM('light', 'recessed');
  CREATE TYPE "public"."enum_pages_blocks_grades_platform_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_applications_grid_layout" AS ENUM('cards', 'list');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_layout" AS ENUM('cards', 'row');
  CREATE TYPE "public"."enum_pages_blocks_team_grid_layout" AS ENUM('grid', 'spread');
  CREATE TYPE "public"."enum__pages_v_blocks_trust_strip_source" AS ENUM('settings', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_two_column_background" AS ENUM('light', 'recessed');
  CREATE TYPE "public"."enum__pages_v_blocks_grades_platform_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_applications_grid_layout" AS ENUM('cards', 'list');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_layout" AS ENUM('cards', 'row');
  CREATE TYPE "public"."enum__pages_v_blocks_team_grid_layout" AS ENUM('grid', 'spread');
  ALTER TYPE "public"."enum_pages_blocks_cta_style" ADD VALUE 'evaluation';
  ALTER TYPE "public"."enum__pages_v_blocks_cta_style" ADD VALUE 'evaluation';
  CREATE TABLE "pages_blocks_trust_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_trust_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_trust_strip_source" DEFAULT 'settings',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trust_strip_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_trust_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__pages_v_blocks_trust_strip_source" DEFAULT 'settings',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_stats_items" ADD COLUMN "unit" varchar;
  ALTER TABLE "pages_blocks_two_column" ADD COLUMN "image_caption" varchar;
  ALTER TABLE "pages_blocks_two_column" ADD COLUMN "image_caption_note" varchar;
  ALTER TABLE "pages_blocks_two_column" ADD COLUMN "second_image_id" integer;
  ALTER TABLE "pages_blocks_two_column" ADD COLUMN "second_image_text" varchar;
  ALTER TABLE "pages_blocks_two_column" ADD COLUMN "quote" varchar;
  ALTER TABLE "pages_blocks_two_column" ADD COLUMN "background" "enum_pages_blocks_two_column_background" DEFAULT 'light';
  ALTER TABLE "pages_blocks_grades_platform" ADD COLUMN "note" varchar;
  ALTER TABLE "pages_blocks_grades_platform" ADD COLUMN "link_type" "enum_pages_blocks_grades_platform_link_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_grades_platform" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_grades_platform" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_grades_platform" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_product_categories" ADD COLUMN "footnote" varchar;
  ALTER TABLE "pages_blocks_product_categories" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_applications_grid" ADD COLUMN "layout" "enum_pages_blocks_applications_grid_layout" DEFAULT 'cards';
  ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "layout" "enum_pages_blocks_services_grid_layout" DEFAULT 'cards';
  ALTER TABLE "pages_blocks_document_list" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_team_grid" ADD COLUMN "layout" "enum_pages_blocks_team_grid_layout" DEFAULT 'grid';
  ALTER TABLE "pages_blocks_faq_block" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "note" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_image_marker" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_image_marker_note" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_image_caption" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_image_caption_note" varchar;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD COLUMN "unit" varchar;
  ALTER TABLE "_pages_v_blocks_two_column" ADD COLUMN "image_caption" varchar;
  ALTER TABLE "_pages_v_blocks_two_column" ADD COLUMN "image_caption_note" varchar;
  ALTER TABLE "_pages_v_blocks_two_column" ADD COLUMN "second_image_id" integer;
  ALTER TABLE "_pages_v_blocks_two_column" ADD COLUMN "second_image_text" varchar;
  ALTER TABLE "_pages_v_blocks_two_column" ADD COLUMN "quote" varchar;
  ALTER TABLE "_pages_v_blocks_two_column" ADD COLUMN "background" "enum__pages_v_blocks_two_column_background" DEFAULT 'light';
  ALTER TABLE "_pages_v_blocks_grades_platform" ADD COLUMN "note" varchar;
  ALTER TABLE "_pages_v_blocks_grades_platform" ADD COLUMN "link_type" "enum__pages_v_blocks_grades_platform_link_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_grades_platform" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_grades_platform" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_grades_platform" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_product_categories" ADD COLUMN "footnote" varchar;
  ALTER TABLE "_pages_v_blocks_product_categories" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_applications_grid" ADD COLUMN "layout" "enum__pages_v_blocks_applications_grid_layout" DEFAULT 'cards';
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "layout" "enum__pages_v_blocks_services_grid_layout" DEFAULT 'cards';
  ALTER TABLE "_pages_v_blocks_document_list" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_team_grid" ADD COLUMN "layout" "enum__pages_v_blocks_team_grid_layout" DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_faq_block" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "note" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_image_marker" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_image_marker_note" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_image_caption" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_image_caption_note" varchar;
  ALTER TABLE "team" ADD COLUMN "tagline" varchar;
  ALTER TABLE "header" ADD COLUMN "tagline" varchar;
  ALTER TABLE "footer" ADD COLUMN "newsletter_heading" varchar DEFAULT 'Notes from the bench';
  ALTER TABLE "footer" ADD COLUMN "newsletter_text" varchar DEFAULT 'Product updates, data and technical notes.';
  ALTER TABLE "footer" ADD COLUMN "newsletter_note" varchar;
  ALTER TABLE "pages_blocks_trust_strip_items" ADD CONSTRAINT "pages_blocks_trust_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_trust_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_strip" ADD CONSTRAINT "pages_blocks_trust_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_strip_items" ADD CONSTRAINT "_pages_v_blocks_trust_strip_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_trust_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_trust_strip" ADD CONSTRAINT "_pages_v_blocks_trust_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_trust_strip_items_order_idx" ON "pages_blocks_trust_strip_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_strip_items_parent_id_idx" ON "pages_blocks_trust_strip_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_strip_order_idx" ON "pages_blocks_trust_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_strip_parent_id_idx" ON "pages_blocks_trust_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_strip_path_idx" ON "pages_blocks_trust_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_trust_strip_items_order_idx" ON "_pages_v_blocks_trust_strip_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trust_strip_items_parent_id_idx" ON "_pages_v_blocks_trust_strip_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_strip_order_idx" ON "_pages_v_blocks_trust_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_trust_strip_parent_id_idx" ON "_pages_v_blocks_trust_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_trust_strip_path_idx" ON "_pages_v_blocks_trust_strip" USING btree ("_path");
  ALTER TABLE "pages_blocks_two_column" ADD CONSTRAINT "pages_blocks_two_column_second_image_id_media_id_fk" FOREIGN KEY ("second_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_column" ADD CONSTRAINT "_pages_v_blocks_two_column_second_image_id_media_id_fk" FOREIGN KEY ("second_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_two_column_second_image_idx" ON "pages_blocks_two_column" USING btree ("second_image_id");
  CREATE INDEX "_pages_v_blocks_two_column_second_image_idx" ON "_pages_v_blocks_two_column" USING btree ("second_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_trust_strip_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_trust_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_trust_strip_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_trust_strip" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_trust_strip_items" CASCADE;
  DROP TABLE "pages_blocks_trust_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_strip_items" CASCADE;
  DROP TABLE "_pages_v_blocks_trust_strip" CASCADE;
  ALTER TABLE "pages_blocks_two_column" DROP CONSTRAINT "pages_blocks_two_column_second_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_two_column" DROP CONSTRAINT "_pages_v_blocks_two_column_second_image_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "style" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "style" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum_pages_blocks_cta_style";
  CREATE TYPE "public"."enum_pages_blocks_cta_style" AS ENUM('dark', 'accent', 'light');
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "style" SET DEFAULT 'dark'::"public"."enum_pages_blocks_cta_style";
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "style" SET DATA TYPE "public"."enum_pages_blocks_cta_style" USING "style"::"public"."enum_pages_blocks_cta_style";
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "style" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "style" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum__pages_v_blocks_cta_style";
  CREATE TYPE "public"."enum__pages_v_blocks_cta_style" AS ENUM('dark', 'accent', 'light');
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "style" SET DEFAULT 'dark'::"public"."enum__pages_v_blocks_cta_style";
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "style" SET DATA TYPE "public"."enum__pages_v_blocks_cta_style" USING "style"::"public"."enum__pages_v_blocks_cta_style";
  DROP INDEX "pages_blocks_two_column_second_image_idx";
  DROP INDEX "_pages_v_blocks_two_column_second_image_idx";
  ALTER TABLE "pages_blocks_stats_items" DROP COLUMN "unit";
  ALTER TABLE "pages_blocks_two_column" DROP COLUMN "image_caption";
  ALTER TABLE "pages_blocks_two_column" DROP COLUMN "image_caption_note";
  ALTER TABLE "pages_blocks_two_column" DROP COLUMN "second_image_id";
  ALTER TABLE "pages_blocks_two_column" DROP COLUMN "second_image_text";
  ALTER TABLE "pages_blocks_two_column" DROP COLUMN "quote";
  ALTER TABLE "pages_blocks_two_column" DROP COLUMN "background";
  ALTER TABLE "pages_blocks_grades_platform" DROP COLUMN "note";
  ALTER TABLE "pages_blocks_grades_platform" DROP COLUMN "link_type";
  ALTER TABLE "pages_blocks_grades_platform" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_grades_platform" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_grades_platform" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_product_categories" DROP COLUMN "footnote";
  ALTER TABLE "pages_blocks_product_categories" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_applications_grid" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_document_list" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_team_grid" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_faq_block" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "note";
  ALTER TABLE "pages" DROP COLUMN "hero_image_marker";
  ALTER TABLE "pages" DROP COLUMN "hero_image_marker_note";
  ALTER TABLE "pages" DROP COLUMN "hero_image_caption";
  ALTER TABLE "pages" DROP COLUMN "hero_image_caption_note";
  ALTER TABLE "_pages_v_blocks_stats_items" DROP COLUMN "unit";
  ALTER TABLE "_pages_v_blocks_two_column" DROP COLUMN "image_caption";
  ALTER TABLE "_pages_v_blocks_two_column" DROP COLUMN "image_caption_note";
  ALTER TABLE "_pages_v_blocks_two_column" DROP COLUMN "second_image_id";
  ALTER TABLE "_pages_v_blocks_two_column" DROP COLUMN "second_image_text";
  ALTER TABLE "_pages_v_blocks_two_column" DROP COLUMN "quote";
  ALTER TABLE "_pages_v_blocks_two_column" DROP COLUMN "background";
  ALTER TABLE "_pages_v_blocks_grades_platform" DROP COLUMN "note";
  ALTER TABLE "_pages_v_blocks_grades_platform" DROP COLUMN "link_type";
  ALTER TABLE "_pages_v_blocks_grades_platform" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_grades_platform" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_grades_platform" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_product_categories" DROP COLUMN "footnote";
  ALTER TABLE "_pages_v_blocks_product_categories" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_applications_grid" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_document_list" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_team_grid" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_faq_block" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "note";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_image_marker";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_image_marker_note";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_image_caption";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_image_caption_note";
  ALTER TABLE "team" DROP COLUMN "tagline";
  ALTER TABLE "header" DROP COLUMN "tagline";
  ALTER TABLE "footer" DROP COLUMN "newsletter_heading";
  ALTER TABLE "footer" DROP COLUMN "newsletter_text";
  ALTER TABLE "footer" DROP COLUMN "newsletter_note";
  DROP TYPE "public"."enum_pages_blocks_trust_strip_source";
  DROP TYPE "public"."enum_pages_blocks_two_column_background";
  DROP TYPE "public"."enum_pages_blocks_grades_platform_link_type";
  DROP TYPE "public"."enum_pages_blocks_applications_grid_layout";
  DROP TYPE "public"."enum_pages_blocks_services_grid_layout";
  DROP TYPE "public"."enum_pages_blocks_team_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_trust_strip_source";
  DROP TYPE "public"."enum__pages_v_blocks_two_column_background";
  DROP TYPE "public"."enum__pages_v_blocks_grades_platform_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_applications_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_team_grid_layout";`)
}
