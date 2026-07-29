CREATE TABLE "admin_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "admin_notes" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "quoted_total_cents" integer;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_sessions_token_hash_unique" ON "admin_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "admin_sessions_expires_at_index" ON "admin_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "orders_status_event_date_index" ON "orders" USING btree ("status","event_date");