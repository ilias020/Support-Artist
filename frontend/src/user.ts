export class User {
	private _username!: string;
	private _email!: string;
	private _firstName!: string;
	private _lastName!: string;
	private _password!: string;

	constructor(username: string, email: string, firstName: string, lastName: string, password: string) {
		this.username = username;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.password = password;
	}

	public get username(): string {
		return this._username;
	}

	public set username(username: string) {
		if (username.length > 20) {
			throw new Error("max length = 20 characters");
		}
		this._username = username;
	}

	public get email(): string {
		return this._email;
	}

	public set email(email: string) {
		if (email.length > 30) {
			throw new Error("max length = 30 characters");
		}
		this._email = email;
	}

	public get firstName(): string {
		return this._firstName;
	}

	public set firstName(firstName: string) {
		if (firstName.length > 20) {
			throw new Error("max length = 20 character");
		}
		this._firstName = firstName;
	}

	public get lastName(): string {
		return this._lastName;
	}

	public set lastName(lastName: string) {
		if (lastName.length > 20) {
			throw new Error("max length = 20 characters");
		}
		this._lastName = lastName;
	}

	public get password(): string {
		return this._password;
	}

	public set password(password: string) {
		if (password.length > 30) {
			throw new Error("max length = 30 characters");
		}
		this._password = password;
	}
}
