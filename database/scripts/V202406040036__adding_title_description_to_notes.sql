CREATE TABLE "Notes_new"(
    "note_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "owner_id" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT '0',
    PRIMARY KEY("note_id")
);

DROP TABLE "Notes";

ALTER TABLE "Notes_new" RENAME TO "Notes";