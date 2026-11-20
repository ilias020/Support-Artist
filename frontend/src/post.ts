export class Post {
	private _description!: string;
	private _postTime!: Date;
	private _artistName?: string;

	constructor(description: string, postTime?: Date, artistName?: string) {
		this.description = description;

		this.postTime = postTime || new Date();

		this.artistName = artistName;
	}

	public get description(): string {
		return this._description;
	}

	public set description(description: string) {
		if (description.length > 200) {
			throw new Error("Max length = 200 characters");
		} else if (!description) {
			throw new Error("Description can not be null or undefined");
		}
		this._description = description;
	}

	public get postTime(): Date {
		return this._postTime;
	}

	public set postTime(postTime: Date | string) {
		const date = new Date(postTime);

		if (!postTime) {
			throw new Error("Post time can not be null or undefined");
		} else if (isNaN(date.getTime())) {
			throw new Error("Invalid timestamp");
		}
		this._postTime = date;
	}

	public get artistName(): string | undefined {
		return this._artistName;
	}

	public set artistName(artistName: string | undefined) {
		if (artistName === undefined) {
			this._artistName = undefined;
			return;
		}

		if (artistName.length > 20) {
			throw new Error("Artist name not valid");
		} else if (artistName === null || "") {
			throw new Error("Artist name can not be null or empty");
		}
		this._artistName = artistName;
	}
}
