export class Contact {
	private _username!: string;
	private _message!: string;
	private _formTime!: Date;
	private _messageStatus!: string;

	constructor(message: string, username: string, messageStatus?: string) {
		this.username = username;
		this.message = message;
		this._formTime = new Date();
		this.messageStatus = messageStatus || "Pending";
	}

	public get username(): string {
		return this._username;
	}

	public set username(username: string) {
		if (!username) {
			throw new Error("Username mag niet null, een lege string of undefined zijn.");
		}
		if (username.length > 20) {
			throw new Error("Username mag maximaal 20 karakters bevatten.");
		}
		this._username = username;
	}

	public set message(message: string) {
		if (!message || message.trim().length === 0) {
			throw new Error("Bericht mag niet leeg zijn.");
		}
		if (message.length > 255) {
			throw new Error("Bericht mag niet langer zijn dan 255 tekens.");
		}
		this._message = message;
	}

	public get message(): string {
		return this._message;
	}

	public get formTime(): Date {
		return this._formTime;
	}

	public get messageStatus(): string {
		return this._messageStatus;
	}

	public set messageStatus(messageStatus: string) {
		const allowedStatuses = ["Pending", "In progress", "Resolved"];
		if (!allowedStatuses.includes(messageStatus)) {
			throw new Error(`Invalid messageStatus. Allowed values are: ${allowedStatuses.join(", ")}`);
		}
		this._messageStatus = messageStatus;
	}
}
