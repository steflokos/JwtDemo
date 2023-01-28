CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20230128103714_InitDB') THEN
    CREATE TABLE "Users" (
        "Username" text NOT NULL,
        "Password" text NOT NULL,
        "FirstName" text NULL,
        "LastName" text NULL,
        "ContactNumber" text NULL,
        "Email" text NULL,
        "Role" text NULL,
        CONSTRAINT "PK_Users" PRIMARY KEY ("Username")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20230128103714_InitDB') THEN
    INSERT INTO "Users" ("Username", "ContactNumber", "Email", "FirstName", "LastName", "Password", "Role")
    VALUES ('admin', '1231231231', 'admin@mail.com', 'admin', 'admin', '2B869D99B804B48A7C24E085D9C6D33B564250A6B9D4FAC221F7EF1690441555:0ECA7C7FDDC829CFEE411646BC96ED18:100000:SHA256', '["Admin"]');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20230128103714_InitDB') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20230128103714_InitDB', '7.0.2');
    END IF;
END $EF$;
COMMIT;

