export class Subscription {
	private _username!: string;
	private _artistname!: string;
	private _subscriptionType!: string;
	private _startDate!: Date;
	private _SubscriptionStatus!: number;

	constructor(username: string, artistname: string, subscriptionType: string, startDate: Date = new Date(), SubscriptionStatus = 1) {
		this.username = username;
		this.artistname = artistname;
		this.subscriptionType = subscriptionType;
		this.startDate = startDate;
		this.SubscriptionStatus = SubscriptionStatus;
	}

	public get username(): string {
		return this._username;
	}

	public set username(username: string) {
		if (username === null || username === undefined || username === "") {
			throw new Error("The username cannot be empty, null or undefined");
		}
		if (username.length > 20) {
			throw new Error("The username may not contain more than 20 characters");
		}
		this._username = username;
	}

	public get artistname(): string {
		return this._artistname;
	}

	public set artistname(artistname: string) {
		if (artistname === null || artistname === undefined || artistname === "") {
			throw new Error("Artist name cannot be empty, null or undefined");
		}
		if (artistname.length > 20) {
			throw new Error("The artistname may not contain more than 20 characters");
		}
		this._artistname = artistname;
	}

	public get subscriptionType(): string {
		return this._subscriptionType;
	}

	public set subscriptionType(subscriptionType: string) {
		const validTypes = ["Basic", "Standard", "Pro Supporter"];
		if (!validTypes.includes(subscriptionType)) {
			throw new Error("Invalid subscription type");
		}
		this._subscriptionType = subscriptionType;
	}

	public get startDate(): Date {
		return this._startDate;
	}

	public set startDate(startDate: Date) {
		this._startDate = startDate;
	}

	public get SubscriptionStatus(): number {
		return this._SubscriptionStatus;
	}

	public set SubscriptionStatus(status: number) {
		this._SubscriptionStatus = status;
	}
}
