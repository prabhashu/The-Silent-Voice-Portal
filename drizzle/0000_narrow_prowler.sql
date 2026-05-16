CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"category" text DEFAULT 'General',
	"studentName" text DEFAULT 'Anonymous',
	"contactInfo" text DEFAULT 'None provided',
	"severity" real NOT NULL,
	"is_high_risk" boolean NOT NULL,
	"status" text DEFAULT 'pending',
	"timestamp" timestamp DEFAULT now() NOT NULL
);
