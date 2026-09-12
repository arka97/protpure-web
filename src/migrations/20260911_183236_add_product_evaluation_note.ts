import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN "evaluation_note" varchar DEFAULT 'Paid evaluation packs of 5–25 mL, or a 1 mL pre-packed column, are quoted on request and come with scientist support, datasheet and certificate of analysis. The cost is credited against your first bulk order; we do not ship free samples.';
  ALTER TABLE "_products_v" ADD COLUMN "version_evaluation_note" varchar DEFAULT 'Paid evaluation packs of 5–25 mL, or a 1 mL pre-packed column, are quoted on request and come with scientist support, datasheet and certificate of analysis. The cost is credited against your first bulk order; we do not ship free samples.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "evaluation_note";
  ALTER TABLE "_products_v" DROP COLUMN "version_evaluation_note";`)
}
