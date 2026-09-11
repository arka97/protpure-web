import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_hero_style" ADD VALUE 'schematic' BEFORE 'compact';
  ALTER TYPE "public"."enum__pages_v_version_hero_style" ADD VALUE 'schematic' BEFORE 'compact';
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "numbered" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "numbered" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ALTER COLUMN "hero_style" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_style" SET DEFAULT 'standard'::text;
  DROP TYPE "public"."enum_pages_hero_style";
  CREATE TYPE "public"."enum_pages_hero_style" AS ENUM('standard', 'compact', 'none');
  ALTER TABLE "pages" ALTER COLUMN "hero_style" SET DEFAULT 'standard'::"public"."enum_pages_hero_style";
  ALTER TABLE "pages" ALTER COLUMN "hero_style" SET DATA TYPE "public"."enum_pages_hero_style" USING "hero_style"::"public"."enum_pages_hero_style";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_style" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_style" SET DEFAULT 'standard'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_style";
  CREATE TYPE "public"."enum__pages_v_version_hero_style" AS ENUM('standard', 'compact', 'none');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_style" SET DEFAULT 'standard'::"public"."enum__pages_v_version_hero_style";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_style" SET DATA TYPE "public"."enum__pages_v_version_hero_style" USING "version_hero_style"::"public"."enum__pages_v_version_hero_style";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "numbered";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "numbered";`)
}
