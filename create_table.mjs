import { Client } from 'pg';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    await client.connect();
    await client.query(`
    CREATE TABLE IF NOT EXISTS "activity_log" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer,
        "user_name" varchar(100),
        "action" varchar(20),
        "target_table" varchar(50),
        "target_id" integer,
        "target_summary" text,
        "ip_address" varchar(50),
        "created_at" timestamp DEFAULT now()
    );
    `);
    console.log("Table created");
    process.exit(0);
}

run().catch(console.error);
