export class UserSession {
	private _username!: string;
	private _password!: string;
	private _userRole?: string;

	constructor(username: string, password: string, userRole?: string) {
		this.username = username;
		this.password = password;
		if (userRole) {
			this.userRole = userRole;
		}
	}

	public get username(): string {
		return this._username;
	}

	public set username(username: string) {
		if (username.length > 20) {
			throw new Error("max length username = 20 characters");
		} else if (!username) {
			throw new Error("Username can not be null or undefined");
		}
		this._username = username;
	}

	public get password(): string {
		return this._password;
	}

	public set password(password: string) {
		if (password.length > 255) {
			throw new Error("max length password = 255 characters");
		} else if (!password) {
			throw new Error("Password can not be null or undefined");
		}
		this._password = password;
	}

	public get userRole(): string | undefined {
		return this._userRole;
	}

	public set userRole(userRole: string) {
		const allowedRoles = ["User", "Artist", "Admin"];
		if (!allowedRoles.includes(userRole)) {
			throw new Error("Invalid userRole");
		}
		this._userRole = userRole;
	}
}
