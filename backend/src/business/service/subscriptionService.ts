import { SubscriptionMysql } from "../../data/models/subscriptionMysql";
import { Subscription } from "../model/subscription";

export class SubscriptionService {
	private _data!: SubscriptionMysql;

	constructor(data: SubscriptionMysql) {
		this._data = data;
	}

	public async usersSubscription(subscriptionData: Subscription): Promise<Subscription> {
		return await this._data.createSubscription(subscriptionData);
	}

	public async getSubscriptionByUsername(username: string): Promise<Subscription> {
		return await this._data.getSubscriptionByUsername(username);
	}

	public async updateSubscriptionStatusByUsername(username: string, artistname: string, subscriptionType: string): Promise<boolean> {
		const result = await this._data.updateSubscriptionStatusByUsername(username, artistname, subscriptionType);
		return result;
	}
}
