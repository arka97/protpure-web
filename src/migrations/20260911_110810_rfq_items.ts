import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_inquiries_items_grade" AS ENUM('faster', 'fast-flow', 'precise', 'hr');
  CREATE TYPE "public"."enum_inquiries_items_purpose" AS ENUM('sample-kit', 'evaluation', 'production', 'other');
  CREATE TABLE "inquiries_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"product_name" varchar NOT NULL,
  	"grade" "enum_inquiries_items_grade",
  	"pack_size" varchar,
  	"catalog_number" varchar,
  	"quantity" numeric DEFAULT 1,
  	"purpose" "enum_inquiries_items_purpose" DEFAULT 'production',
  	"notes" varchar
  );
  
  ALTER TABLE "inquiries_items" ADD CONSTRAINT "inquiries_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries_items" ADD CONSTRAINT "inquiries_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "inquiries_items_order_idx" ON "inquiries_items" USING btree ("_order");
  CREATE INDEX "inquiries_items_parent_id_idx" ON "inquiries_items" USING btree ("_parent_id");
  CREATE INDEX "inquiries_items_product_idx" ON "inquiries_items" USING btree ("product_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "inquiries_items" CASCADE;
  DROP TYPE "public"."enum_inquiries_items_grade";
  DROP TYPE "public"."enum_inquiries_items_purpose";`)
}
