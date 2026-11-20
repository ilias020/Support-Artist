import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { UserSessionMysql } from "../../data/models/userSessionMysql";
import { errorMessage } from "../../util/errors";
import { UserSession } from "../model/userSession";

interface UserSessionResponse {
	userSessionData: UserSession;
	token: string;
}

export class UserSessionService {
	private _data!: UserSessionMysql;

	constructor(data: UserSessionMysql) {
		this._data = data;
	}

	public async signinUser(userSession: UserSession): Promise<UserSessionResponse> {
		try {
			const dbUser = await this._data.signin(userSession);
			let passwordMatches = false;
			if (userSession.password !== undefined && dbUser.password !== undefined) {
				passwordMatches = await bcrypt.compare(userSession.password, dbUser.password);
			}

			if (!passwordMatches) {
				throw new Error("User not valid");
			}

			const userRole = dbUser.userRole;
			if (userRole === undefined) {
				throw new Error("Some error occurred");
			} else {
				const userSessionData: UserSession = new UserSession(dbUser.username);
				userSessionData.userRole = userRole;

				const token = this.generateAuthToken(dbUser.username, userRole);

				return { userSessionData, token };
			}
		} catch (error) {
			throw new Error("Service error: " + errorMessage(error));
		}
	}

	private generateAuthToken(username: string, userRole: string): string {
		const payload = { username, userRole };
		const secretKey: string = config.jwtSecret;

		if (!secretKey) {
			throw new Error("JWT_SECRET is not configured.");
		}

		const options = { expiresIn: "1h" };

		try {
			const token = jwt.sign(payload, secretKey, options);
			return token;
		} catch {
			throw new Error("Token generation failed.");
		}
	}
}
