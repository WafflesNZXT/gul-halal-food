CREATE TYPE "public"."notification_channel" AS ENUM('sms', 'email');--> statement-breakpoint
CREATE TYPE "public"."notification_recipient_type" AS ENUM('customer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('pending', 'sent', 'failed', 'not_configured', 'skipped_no_consent');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('customer_order_confirmation', 'admin_new_order');--> statement-breakpoint
CREATE TABLE "notification_deliveries" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"channel" "notification_channel" NOT NULL,
	"notification_type" "notification_type" NOT NULL,
	"recipient_type" "notification_recipient_type" NOT NULL,
	"recipient_hash" text NOT NULL,
	"status" "notification_status" DEFAULT 'pending' NOT NULL,
	"provider_message_id" text,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"last_error_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "order_items" RENAME COLUMN "unit_price" TO "unit_price_cents";--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "unit_price_cents" TYPE integer USING (
	CASE
		WHEN "unit_price_cents" IS NULL OR btrim("unit_price_cents") = '' THEN NULL
		WHEN btrim("unit_price_cents") ~ '^[0-9]+$' THEN btrim("unit_price_cents")::integer
		ELSE NULL
	END
);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "line_total_cents" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "sms_consent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "sms_consent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "notification_deliveries_idempotency_unique" ON "notification_deliveries" USING btree ("order_id","channel","notification_type","recipient_hash");--> statement-breakpoint
CREATE INDEX "notification_deliveries_order_id_index" ON "notification_deliveries" USING btree ("order_id");
