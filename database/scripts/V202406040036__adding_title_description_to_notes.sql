CREATE TABLE "Notes_new" (
    "note_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "owner_id" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT '0'
);


INSERT INTO "Notes_new" (
    "note_id",
    "title",
    "description",
    "owner_id",
    "content",
    "created_at",
    "updated_at",
    "is_public"
)
SELECT
    "note_id",
    '', 
    '',
    "owner_id",
    "content_url", 
    "created_at",
    "updated_at",
    "is_public"
FROM
    "Notes";


ALTER TABLE "NoteAccess" DROP CONSTRAINT "noteaccess_note_id_foreign";


DROP TABLE "Notes";


ALTER TABLE "Notes_new" RENAME TO "Notes";

ALTER TABLE "Notes" ADD PRIMARY KEY("note_id");

COMMENT ON COLUMN "Notes"."is_public" IS 'Private by default';

ALTER TABLE "NoteAccess" DROP CONSTRAINT "noteaccess_user_id_foreign"; -- Drop the existing constraint
ALTER TABLE "NoteAccess" ADD CONSTRAINT "noteaccess_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "Users"("user_id");
ALTER TABLE "Notes" ADD CONSTRAINT "notes_owner_id_foreign" FOREIGN KEY("owner_id") REFERENCES "Users"("user_id");
ALTER TABLE "NoteAccess" ADD CONSTRAINT "noteaccess_note_id_foreign" FOREIGN KEY("note_id") REFERENCES "Notes"("note_id");
