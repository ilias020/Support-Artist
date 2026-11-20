import dotenv from "dotenv";

dotenv.config();

export const config = {
	port: Number(process.env.PORT ?? 4001),
	corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:8080",
	database: {
		host: process.env.DB_HOST ?? "localhost",
		port: Number(process.env.DB_PORT ?? 3306),
		user: process.env.DB_USER ?? "",
		password: process.env.DB_PASSWORD ?? "",
		name: process.env.DB_NAME ?? "support_artist_db"
	},
	jwtSecret: process.env.JWT_SECRET ?? ""
};
