import { RowDataPacket } from "mysql2";
import { UserSession } from "../../business/model/userSession";
import { pool } from "../../util/database";
import { errorMessage } from "../../util/errors";

export class UserSessionMysql {
	public async signin(userSession: UserSession): Promise<UserSession> {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>("SELECT userName, password, userRole FROM `support_artist_db`.`users` WHERE userName = ?;", [
					userSession.username
				]);
			if (rows.length === 0) {
				throw new Error("User not found");
			}
			const dbUser = rows[0];
			const dbUserSession = new UserSession(dbUser.userName);
			dbUserSession.password = dbUser.password;
			dbUserSession.userRole = dbUser.userRole;
			return dbUserSession;
		} catch (error) {
			throw new Error("Something went wrong while fetching the user" + errorMessage(error));
		}
	}
}
