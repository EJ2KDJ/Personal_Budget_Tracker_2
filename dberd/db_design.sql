CREATE TABLE "users" (
  "id" int PRIMARY KEY,
  "username" varchar(50) UNIQUE,
  "email" varchar(100) UNIQUE,
  "password_hash" text,
  "created_at" timestamp
);

CREATE TABLE "categories" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "name" varchar(50),
  "type" varchar(10),
  "created_at" timestamp
);

CREATE TABLE "envelopes" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "category_id" int,
  "title" varchar(50),
  "budget" decimal(10,2),
  "created_at" timestamp
);

CREATE TABLE "transactions" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "envelope_id" int,
  "amount" decimal(10,2),
  "type" varchar(10),
  "description" text,
  "date" timestamp
);

CREATE TABLE "transfers" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "from_envelope_id" int,
  "to_envelope_id" int,
  "amount" decimal(10,2),
  "date" timestamp
);

CREATE TABLE "recurring_transactions" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "envelope_id" int,
  "amount" decimal(10,2),
  "type" varchar(10),
  "description" text,
  "frequency" varchar(20),
  "next_occurrence" date
);

ALTER TABLE "categories" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "envelopes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "envelopes" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "transactions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "transactions" ADD FOREIGN KEY ("envelope_id") REFERENCES "envelopes" ("id");

ALTER TABLE "transfers" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "transfers" ADD FOREIGN KEY ("from_envelope_id") REFERENCES "envelopes" ("id");

ALTER TABLE "transfers" ADD FOREIGN KEY ("to_envelope_id") REFERENCES "envelopes" ("id");

ALTER TABLE "recurring_transactions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "recurring_transactions" ADD FOREIGN KEY ("envelope_id") REFERENCES "envelopes" ("id");
