CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table: public.moths

-- drop if it exists
DROP TABLE IF EXISTS public.moths;

CREATE TABLE public.moths
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    species text,
    wingspan double precision,
    weight double precision,
    last_spotted json,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE moths
    OWNER to "postgres";
