import express from "express";
import { UserSession } from "../business/model/userSession";
import { UserSessionService } from "../business/service/userSessionService";
import { errorMessage } from "../util/errors";

export class UserSessionController {
	private _service!: UserSessionService;

	constructor(service: UserSessionService) {
		this._service = service;
	}

	public async signin(req: express.Request, res: express.Response): Promise<void> {
		const userData: { username?: string; password?: string } = {
			username: req.body._username,
			password: req.body._password
		};
		try {
			if (userData.password !== undefined && userData.username !== undefined) {
				const userSession: UserSession = new UserSession(userData.username);
				userSession.password = userData.password;
				const session = await this._service.signinUser(userSession);
				res.status(200).json(session);
			} else {
				throw new Error("Information missing");
			}
		} catch (error) {
			console.error(error);
			res.status(400).json(errorMessage(error));
		}
	}
}
