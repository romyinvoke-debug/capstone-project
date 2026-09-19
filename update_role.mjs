import { Client } from 'pg';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    await client.connect();
    
    // Update all users to admin for testing purposes, or specifically find 'Romi'
    const result = await client.query(`UPDATE "users" SET role = 'admin' RETURNING *;`);
    console.log("Updated users:", result.rows.map(r => ({id: r.id, name: r.nama_lengkap, username: r.username, role: r.role})));
    
    process.exit(0);
}

run().catch(console.error);
