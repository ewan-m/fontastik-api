import { Pool } from "pg";
import { Module } from "@nestjs/common";

export const PG_CONNECTION = "PG CONNECTION";

const dbProvider = {
	provide: PG_CONNECTION,
	useValue: new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false },
	}),
};

@Module({ providers: [dbProvider], exports: [dbProvider] })
export class DatabaseModule {}
