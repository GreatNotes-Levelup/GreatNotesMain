CREATE TABLE "NoteAccess"(
    "note_access_id" BIGSERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "note_id" BIGINT NOT NULL,
    "is_read_only" BOOLEAN NOT NULL DEFAULT '1',
    PRIMARY KEY("note_access_id")
);
COMMENT ON COLUMN "NoteAccess"."is_read_only" IS 'default is read-only and you can toggle edit mode';

CREATE TABLE "Users"(
    "user_id" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    PRIMARY KEY("user_id")
);

CREATE TABLE "Notes"(
    "note_id" BIGSERIAL NOT NULL,
    "owner_id" VARCHAR(255) NOT NULL,
    "content_url" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT '0',
    PRIMARY KEY("note_id")
);
COMMENT ON COLUMN "Notes"."is_public" IS 'Private by default';

ALTER TABLE "NoteAccess" ADD CONSTRAINT "noteaccess_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "Users"("user_id");
ALTER TABLE "Notes" ADD CONSTRAINT "notes_owner_id_foreign" FOREIGN KEY("owner_id") REFERENCES "Users"("user_id");
ALTER TABLE "NoteAccess" ADD CONSTRAINT "noteaccess_note_id_foreign" FOREIGN KEY("note_id") REFERENCES "Notes"("note_id");
