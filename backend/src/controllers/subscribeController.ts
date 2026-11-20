import express from "express";
import { Subscription } from "../business/model/subscription";
import { SubscriptionService } from "../business/service/subscriptionService";
import { errorMessage } from "../util/errors";

export class SubscribeController {
	private _service: SubscriptionService;

	constructor(service: SubscriptionService) {
		this._service = service;
	}

	public async createSubscription(req: express.Request, res: express.Response): Promise<void> {
		const username: string = req.body.username;
		const artistname: string = req.body.artistname;
		const subscriptionType: string = req.body.subscriptionType;
		try {
			const subscription: Subscription = new Subscription(username, artistname, subscriptionType);
			await this._service.usersSubscription(subscription);
			res.status(201).json({ Reply: "Subscription created succesfully" });
		} catch (error) {
			console.error(error);
			res.status(400).json(errorMessage(error));
		}
	}

	public async getSubscription(req: express.Request, res: express.Response): Promise<void> {
		const username: string = req.params.username;
		try {
			const subscription = await this._service.getSubscriptionByUsername(username);
			if (subscription) {
				res.status(200).json(subscription);
			} else {
				res.status(404).json({ message: "Subscriptions not found" });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: errorMessage(error) });
		}
	}

	public async updateSubscriptionStatus(req: express.Request, res: express.Response): Promise<void> {
		const username: string = req.params.username;
		const artistname: string = req.body.artistname;
		const subscriptionType: string = req.body.subscriptionType;
		try {
			const subscription = await this._service.updateSubscriptionStatusByUsername(username, artistname, subscriptionType);

			if (!subscription) {
				res.status(400).json("400 from the controller layer (subscription == false)");
			} else {
				res.status(200).json("subscription status changed");
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: errorMessage(error) });
		}
	}
}
