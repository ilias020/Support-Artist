import express from "express";
import { User } from "../business/model/user";
import { UserService } from "../business/service/userService";
import { errorMessage } from "../util/errors";

export class UserController {
	private _service!: UserService;
	constructor(service: UserService) {
		this._service = service;
	}

	public async register(req: express.Request, res: express.Response): Promise<void> {
		const username: string = req.body.username;
		const email: string = req.body.email;
		const firstName: string = req.body.firstName;
		const lastName: string = req.body.lastName;
		const password: string = req.body.password;
		const userStatus: string = req.body.userStatus;
		const userRole: string = req.body.userRole;
		try {
			const user: User = new User(username, email, firstName, lastName, password, userStatus, userRole);
			await this._service.registerUser(user);
			res.status(201).json({ message: "User registered" });
		} catch (error) {
			console.error(error);
			res.status(400).json({ error: errorMessage(error) });
		}
	}
}
