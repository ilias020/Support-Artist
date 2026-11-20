import { ResultSetHeader } from "mysql2";
import { User } from "../../business/model/user";
import { pool } from "../../util/database";
import { errorMessage, mysqlErrno } from "../../util/errors";

export class UserMysql {
	public async register(user: User): Promise<User> {
		try {
			await pool
				.promise()
				.execute<ResultSetHeader>(
					"INSERT INTO `support_artist_db`.`users` (`UserName`, `Email`, `FirstName`, `LastName`, `Password`, UserStatus, UserRole) VALUES (?, ?, ?, ?, ?, ?, ?);",
					[user.username, user.email, user.firstName, user.lastName, user.password, user.userStatus, user.userRole]
				);
			return user;
		} catch (error) {
			if (mysqlErrno(error) === 1062) {
				throw new Error("User already exists");
			} else {
				throw new Error("Something went wrong while adding user" + errorMessage(error));
			}
		}
	}
}
