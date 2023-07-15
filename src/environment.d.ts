export {};
import type { PathOrFileDescriptor } from "fs";

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			APP_ENV: string;
			COOKIE_SECRET: string;
			SUPERADMIN_USERNAME: string;
			SUPERADMIN_PASSWORD: string;
			DB_HOST: string;
			DB_PORT: number;
			DB_NAME: string;
			DB_USERNAME: string;
			DB_PASSWORD: string;
			DB_SCHEMA: string;
			DO_SPACE_ID: string;
			DO_SPACE_SECRET_KEY: string;
			DO_SPACE_ENDPOINT: string;
			CERT_PATH: string;
		}
	}
}
