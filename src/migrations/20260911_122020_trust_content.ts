import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_linked_in_feed_kind" AS ENUM('product-launch', 'data', 'milestone', 'services', 'perspective');
  CREATE TYPE "public"."enum_pages_blocks_logo_wall_source" AS ENUM('all', 'picked');
  CREATE TYPE "public"."enum_pages_blocks_certifications_strip_kinds" AS ENUM('quality-system', 'product-claim', 'regulatory', 'membership', 'award');
  CREATE TYPE "public"."enum_pages_blocks_gallery_layout" AS ENUM('grid', 'strip', 'spread');
  CREATE TYPE "public"."enum_pages_blocks_proof_bar_style" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_linked_in_feed_kind" AS ENUM('product-launch', 'data', 'milestone', 'services', 'perspective');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_wall_source" AS ENUM('all', 'picked');
  CREATE TYPE "public"."enum__pages_v_blocks_certifications_strip_kinds" AS ENUM('quality-system', 'product-claim', 'regulatory', 'membership', 'award');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_layout" AS ENUM('grid', 'strip', 'spread');
  CREATE TYPE "public"."enum__pages_v_blocks_proof_bar_style" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum_updates_kind" AS ENUM('product-launch', 'data', 'milestone', 'services', 'perspective');
  CREATE TYPE "public"."enum_updates_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__updates_v_version_kind" AS ENUM('product-launch', 'data', 'milestone', 'services', 'perspective');
  CREATE TYPE "public"."enum__updates_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonials_context" AS ENUM('evaluation', 'production', 'research', 'distributor');
  CREATE TYPE "public"."enum_certifications_kind" AS ENUM('quality-system', 'product-claim', 'regulatory', 'membership', 'award');
  CREATE TYPE "public"."enum_customers_sector" AS ENUM('biopharma', 'vaccines', 'diagnostics', 'cdmo', 'research', 'distributor');
  CREATE TABLE "pages_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"source" "enum_pages_blocks_logo_wall_source" DEFAULT 'all',
  	"fallback_statement" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_certifications_strip_kinds" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_certifications_strip_kinds",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_certifications_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"limit" numeric DEFAULT 8,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"layout" "enum_pages_blocks_gallery_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"member_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_proof_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_statement" boolean DEFAULT true,
  	"style" "enum_pages_blocks_proof_bar_style" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"source" "enum__pages_v_blocks_logo_wall_source" DEFAULT 'all',
  	"fallback_statement" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_certifications_strip_kinds" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_certifications_strip_kinds",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_certifications_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"limit" numeric DEFAULT 8,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" varchar,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"layout" "enum__pages_v_blocks_gallery_layout" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"member_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_proof_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_statement" boolean DEFAULT true,
  	"style" "enum__pages_v_blocks_proof_bar_style" DEFAULT 'light',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_updates_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_url" varchar,
  	"version_urn" varchar,
  	"version_summary" varchar,
  	"version_image_id" integer,
  	"version_kind" "enum__updates_v_version_kind",
  	"version_published_at" timestamp(3) with time zone,
  	"version_pinned" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__updates_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_updates_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "team_credentials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "team_expertise" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "team_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"journal" varchar,
  	"year" numeric,
  	"url" varchar
  );
  
  CREATE TABLE "certifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"kind" "enum_certifications_kind" DEFAULT 'product-claim' NOT NULL,
  	"issuer" varchar,
  	"statement" varchar,
  	"valid_until" timestamp(3) with time zone,
  	"document_id" integer,
  	"logo_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"website" varchar,
  	"sector" "enum_customers_sector",
  	"country" varchar,
  	"anonymised_label" varchar,
  	"show_logo" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "updates" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "updates" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "updates" ALTER COLUMN "summary" DROP NOT NULL;
  ALTER TABLE "updates" ALTER COLUMN "published_at" DROP NOT NULL;
  ALTER TABLE "pages_blocks_linked_in_feed" ADD COLUMN "kind" "enum_pages_blocks_linked_in_feed_kind";
  ALTER TABLE "pages_rels" ADD COLUMN "customers_id" integer;
  ALTER TABLE "_pages_v_blocks_linked_in_feed" ADD COLUMN "kind" "enum__pages_v_blocks_linked_in_feed_kind";
  ALTER TABLE "_pages_v_rels" ADD COLUMN "customers_id" integer;
  ALTER TABLE "updates" ADD COLUMN "kind" "enum_updates_kind";
  ALTER TABLE "updates" ADD COLUMN "_status" "enum_updates_status" DEFAULT 'draft';
  -- Updates created before drafts existed were all public: keep them published.
  UPDATE "updates" SET "_status" = 'published';
  ALTER TABLE "team" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "testimonials" ADD COLUMN "context" "enum_testimonials_context";
  ALTER TABLE "testimonials" ADD COLUMN "consent_on_file" boolean DEFAULT false;
  ALTER TABLE "testimonials" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "certifications_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "customers_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "proof_founded_text" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "proof_team_size" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "proof_capacity" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "proof_customers_statement" varchar DEFAULT 'Used in GMP facilities. Repeat orders from Indian biopharma.';
  ALTER TABLE "site_settings" ADD COLUMN "proof_linkedin_followers" numeric;
  ALTER TABLE "pages_blocks_logo_wall" ADD CONSTRAINT "pages_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_certifications_strip_kinds" ADD CONSTRAINT "pages_blocks_certifications_strip_kinds_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_certifications_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_certifications_strip" ADD CONSTRAINT "pages_blocks_certifications_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_items" ADD CONSTRAINT "pages_blocks_gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_items" ADD CONSTRAINT "pages_blocks_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_publications" ADD CONSTRAINT "pages_blocks_publications_member_id_team_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_publications" ADD CONSTRAINT "pages_blocks_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof_bar" ADD CONSTRAINT "pages_blocks_proof_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_wall" ADD CONSTRAINT "_pages_v_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_certifications_strip_kinds" ADD CONSTRAINT "_pages_v_blocks_certifications_strip_kinds_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_certifications_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_certifications_strip" ADD CONSTRAINT "_pages_v_blocks_certifications_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_items" ADD CONSTRAINT "_pages_v_blocks_gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_items" ADD CONSTRAINT "_pages_v_blocks_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_publications" ADD CONSTRAINT "_pages_v_blocks_publications_member_id_team_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_publications" ADD CONSTRAINT "_pages_v_blocks_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof_bar" ADD CONSTRAINT "_pages_v_blocks_proof_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_updates_v" ADD CONSTRAINT "_updates_v_parent_id_updates_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."updates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_updates_v" ADD CONSTRAINT "_updates_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_updates_v_rels" ADD CONSTRAINT "_updates_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_updates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_updates_v_rels" ADD CONSTRAINT "_updates_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_credentials" ADD CONSTRAINT "team_credentials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_expertise" ADD CONSTRAINT "team_expertise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_publications" ADD CONSTRAINT "team_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certifications" ADD CONSTRAINT "certifications_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certifications" ADD CONSTRAINT "certifications_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_logo_wall_order_idx" ON "pages_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_wall_parent_id_idx" ON "pages_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_wall_path_idx" ON "pages_blocks_logo_wall" USING btree ("_path");
  CREATE INDEX "pages_blocks_certifications_strip_kinds_order_idx" ON "pages_blocks_certifications_strip_kinds" USING btree ("order");
  CREATE INDEX "pages_blocks_certifications_strip_kinds_parent_idx" ON "pages_blocks_certifications_strip_kinds" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_certifications_strip_order_idx" ON "pages_blocks_certifications_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_certifications_strip_parent_id_idx" ON "pages_blocks_certifications_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_certifications_strip_path_idx" ON "pages_blocks_certifications_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_items_order_idx" ON "pages_blocks_gallery_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_items_parent_id_idx" ON "pages_blocks_gallery_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_items_image_idx" ON "pages_blocks_gallery_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_publications_order_idx" ON "pages_blocks_publications" USING btree ("_order");
  CREATE INDEX "pages_blocks_publications_parent_id_idx" ON "pages_blocks_publications" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_publications_path_idx" ON "pages_blocks_publications" USING btree ("_path");
  CREATE INDEX "pages_blocks_publications_member_idx" ON "pages_blocks_publications" USING btree ("member_id");
  CREATE INDEX "pages_blocks_proof_bar_order_idx" ON "pages_blocks_proof_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_proof_bar_parent_id_idx" ON "pages_blocks_proof_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_proof_bar_path_idx" ON "pages_blocks_proof_bar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_wall_order_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_wall_parent_id_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_wall_path_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_certifications_strip_kinds_order_idx" ON "_pages_v_blocks_certifications_strip_kinds" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_certifications_strip_kinds_parent_idx" ON "_pages_v_blocks_certifications_strip_kinds" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_certifications_strip_order_idx" ON "_pages_v_blocks_certifications_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_certifications_strip_parent_id_idx" ON "_pages_v_blocks_certifications_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_certifications_strip_path_idx" ON "_pages_v_blocks_certifications_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_items_order_idx" ON "_pages_v_blocks_gallery_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_items_parent_id_idx" ON "_pages_v_blocks_gallery_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_items_image_idx" ON "_pages_v_blocks_gallery_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_publications_order_idx" ON "_pages_v_blocks_publications" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_publications_parent_id_idx" ON "_pages_v_blocks_publications" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_publications_path_idx" ON "_pages_v_blocks_publications" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_publications_member_idx" ON "_pages_v_blocks_publications" USING btree ("member_id");
  CREATE INDEX "_pages_v_blocks_proof_bar_order_idx" ON "_pages_v_blocks_proof_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_proof_bar_parent_id_idx" ON "_pages_v_blocks_proof_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_proof_bar_path_idx" ON "_pages_v_blocks_proof_bar" USING btree ("_path");
  CREATE INDEX "_updates_v_parent_idx" ON "_updates_v" USING btree ("parent_id");
  CREATE INDEX "_updates_v_version_version_image_idx" ON "_updates_v" USING btree ("version_image_id");
  CREATE INDEX "_updates_v_version_version_updated_at_idx" ON "_updates_v" USING btree ("version_updated_at");
  CREATE INDEX "_updates_v_version_version_created_at_idx" ON "_updates_v" USING btree ("version_created_at");
  CREATE INDEX "_updates_v_version_version__status_idx" ON "_updates_v" USING btree ("version__status");
  CREATE INDEX "_updates_v_created_at_idx" ON "_updates_v" USING btree ("created_at");
  CREATE INDEX "_updates_v_updated_at_idx" ON "_updates_v" USING btree ("updated_at");
  CREATE INDEX "_updates_v_latest_idx" ON "_updates_v" USING btree ("latest");
  CREATE INDEX "_updates_v_rels_order_idx" ON "_updates_v_rels" USING btree ("order");
  CREATE INDEX "_updates_v_rels_parent_idx" ON "_updates_v_rels" USING btree ("parent_id");
  CREATE INDEX "_updates_v_rels_path_idx" ON "_updates_v_rels" USING btree ("path");
  CREATE INDEX "_updates_v_rels_products_id_idx" ON "_updates_v_rels" USING btree ("products_id");
  CREATE INDEX "team_credentials_order_idx" ON "team_credentials" USING btree ("_order");
  CREATE INDEX "team_credentials_parent_id_idx" ON "team_credentials" USING btree ("_parent_id");
  CREATE INDEX "team_expertise_order_idx" ON "team_expertise" USING btree ("_order");
  CREATE INDEX "team_expertise_parent_id_idx" ON "team_expertise" USING btree ("_parent_id");
  CREATE INDEX "team_publications_order_idx" ON "team_publications" USING btree ("_order");
  CREATE INDEX "team_publications_parent_id_idx" ON "team_publications" USING btree ("_parent_id");
  CREATE INDEX "certifications_document_idx" ON "certifications" USING btree ("document_id");
  CREATE INDEX "certifications_logo_idx" ON "certifications" USING btree ("logo_id");
  CREATE INDEX "certifications_updated_at_idx" ON "certifications" USING btree ("updated_at");
  CREATE INDEX "certifications_created_at_idx" ON "certifications" USING btree ("created_at");
  CREATE INDEX "customers_logo_idx" ON "customers" USING btree ("logo_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certifications_fk" FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_customers_id_idx" ON "pages_rels" USING btree ("customers_id");
  CREATE INDEX "_pages_v_rels_customers_id_idx" ON "_pages_v_rels" USING btree ("customers_id");
  CREATE INDEX "updates__status_idx" ON "updates" USING btree ("_status");
  CREATE INDEX "payload_locked_documents_rels_certifications_id_idx" ON "payload_locked_documents_rels" USING btree ("certifications_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_logo_wall" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_certifications_strip_kinds" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_certifications_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_publications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_proof_bar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_wall" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_certifications_strip_kinds" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_certifications_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gallery_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_publications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_proof_bar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_updates_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_updates_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_credentials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_expertise" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_publications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "certifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "customers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_logo_wall" CASCADE;
  DROP TABLE "pages_blocks_certifications_strip_kinds" CASCADE;
  DROP TABLE "pages_blocks_certifications_strip" CASCADE;
  DROP TABLE "pages_blocks_gallery_items" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_publications" CASCADE;
  DROP TABLE "pages_blocks_proof_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_wall" CASCADE;
  DROP TABLE "_pages_v_blocks_certifications_strip_kinds" CASCADE;
  DROP TABLE "_pages_v_blocks_certifications_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_items" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_publications" CASCADE;
  DROP TABLE "_pages_v_blocks_proof_bar" CASCADE;
  DROP TABLE "_updates_v" CASCADE;
  DROP TABLE "_updates_v_rels" CASCADE;
  DROP TABLE "team_credentials" CASCADE;
  DROP TABLE "team_expertise" CASCADE;
  DROP TABLE "team_publications" CASCADE;
  DROP TABLE "certifications" CASCADE;
  DROP TABLE "customers" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_customers_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_customers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_certifications_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_customers_fk";
  
  DROP INDEX "pages_rels_customers_id_idx";
  DROP INDEX "_pages_v_rels_customers_id_idx";
  DROP INDEX "updates__status_idx";
  DROP INDEX "payload_locked_documents_rels_certifications_id_idx";
  DROP INDEX "payload_locked_documents_rels_customers_id_idx";
  ALTER TABLE "updates" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "updates" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "updates" ALTER COLUMN "summary" SET NOT NULL;
  ALTER TABLE "updates" ALTER COLUMN "published_at" SET NOT NULL;
  ALTER TABLE "pages_blocks_linked_in_feed" DROP COLUMN "kind";
  ALTER TABLE "pages_rels" DROP COLUMN "customers_id";
  ALTER TABLE "_pages_v_blocks_linked_in_feed" DROP COLUMN "kind";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "customers_id";
  ALTER TABLE "updates" DROP COLUMN "kind";
  ALTER TABLE "updates" DROP COLUMN "_status";
  ALTER TABLE "team" DROP COLUMN "featured";
  ALTER TABLE "testimonials" DROP COLUMN "context";
  ALTER TABLE "testimonials" DROP COLUMN "consent_on_file";
  ALTER TABLE "testimonials" DROP COLUMN "featured";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "certifications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "customers_id";
  ALTER TABLE "site_settings" DROP COLUMN "proof_founded_text";
  ALTER TABLE "site_settings" DROP COLUMN "proof_team_size";
  ALTER TABLE "site_settings" DROP COLUMN "proof_capacity";
  ALTER TABLE "site_settings" DROP COLUMN "proof_customers_statement";
  ALTER TABLE "site_settings" DROP COLUMN "proof_linkedin_followers";
  DROP TYPE "public"."enum_pages_blocks_linked_in_feed_kind";
  DROP TYPE "public"."enum_pages_blocks_logo_wall_source";
  DROP TYPE "public"."enum_pages_blocks_certifications_strip_kinds";
  DROP TYPE "public"."enum_pages_blocks_gallery_layout";
  DROP TYPE "public"."enum_pages_blocks_proof_bar_style";
  DROP TYPE "public"."enum__pages_v_blocks_linked_in_feed_kind";
  DROP TYPE "public"."enum__pages_v_blocks_logo_wall_source";
  DROP TYPE "public"."enum__pages_v_blocks_certifications_strip_kinds";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_layout";
  DROP TYPE "public"."enum__pages_v_blocks_proof_bar_style";
  DROP TYPE "public"."enum_updates_kind";
  DROP TYPE "public"."enum_updates_status";
  DROP TYPE "public"."enum__updates_v_version_kind";
  DROP TYPE "public"."enum__updates_v_version_status";
  DROP TYPE "public"."enum_testimonials_context";
  DROP TYPE "public"."enum_certifications_kind";
  DROP TYPE "public"."enum_customers_sector";`)
}
