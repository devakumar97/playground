import { drizzle } from 'drizzle-orm/node-postgres' // Drizzle adapter for PostgreSQL (node-postgres)
import { Pool } from 'pg'  // Official PostgreSQL client
import * as schema from '../../drizzle/schema'  // Import all your Drizzle tables/schema
import { remember } from '@epic-web/remember'

export const db = remember('drizzle', () => {
	
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	})

	const client = drizzle(pool, { schema })

	return client
	
})

console.log("Connected to DB:", process.env.DATABASE_URL);