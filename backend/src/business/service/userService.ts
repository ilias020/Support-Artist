import bcrypt from "bcryptjs";
import { UserMysql } from "../../data/models/userMysql";
import { User } from "../model/user";

export class UserService {
	private _data!: UserMysql;

	constructor(data: UserMysql) {
		this._data = data;
	}

	public async registerUser(user: User): Promise<User> {
		const saltRounds = 10;
		user.password = await bcrypt.hash(user.password, saltRounds);

		return this._data.register(user);
	}
}
