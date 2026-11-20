import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Subscription } from "../../business/model/subscription";
import { pool } from "../../util/database";
import { mysqlErrno } from "../../util/errors";

export class SubscriptionMysql {
	public async createSubscription(subscription: Subscription): Promise<Subscription> {
		try {
			const username = subscription.username ?? null;
			const artistname = subscription.artistname ?? null;
			const subscriptionType = subscription.subscriptionType ?? null;
			const startDate = subscription.startDate;
			const status = subscription.SubscriptionStatus;

			await pool
				.promise()
				.execute<ResultSetHeader>(
					"INSERT INTO `support_artist_db`.`subscriptions` (`UserName`, `ArtistName`, `SubscriptionName`, `StartDate`, `SubscriptionStatus`) VALUES (?, ?, ?, ?, ?);",
					[username, artistname, subscriptionType, startDate, status]
				);
			return subscription;
		} catch (error) {
			if (mysqlErrno(error) === 1062) {
				throw new Error("Subscription already created");
			} else {
				console.error("Unexpected error:", error);
				throw new Error("Something went wrong (with de data layer)");
			}
		}
	}

	public async getSubscriptionByUsername(username: string): Promise<Subscription> {
		try {
			const [results] = await pool.promise().query<RowDataPacket[]>(
				`SELECT
        subscriptions.username,
        subscriptions.artistname,
        subscriptions.SubscriptionName,
        subscriptions.StartDate,
        subscriptions.SubscriptionStatus,
        subscriptiontypes.price
      FROM
        subscriptions
      JOIN
        subscriptiontypes
      ON
        subscriptions.SubscriptionName = subscriptiontypes.SubscriptionName
      WHERE
        subscriptions.username = ?`,
				[username]
			);

			return results as unknown as Subscription;
		} catch (error) {
			console.error("Error fetching subscription:", error);
			throw new Error("Error fetching subscription data");
		}
	}

	public async updateSubscriptionStatusByUsername(username: string, artistname: string, subscriptionType: string): Promise<boolean> {
		try {
			const subscription = await this.getSubscriptionByCompositeKey(username, artistname, subscriptionType);
			if (!subscription) {
				throw new Error("Subscription not found.");
			}
			if (subscription.SubscriptionStatus === 1) {
				await pool
					.promise()
					.execute<RowDataPacket[]>(
						"UPDATE `support_artist_db`.`subscriptions` SET `SubscriptionStatus` = ? WHERE UserName = ? AND ArtistName = ? AND SubscriptionName = ?",
						[0, username, artistname, subscriptionType]
					);
				return true;
			} else if (subscription.SubscriptionStatus === 0) {
				await pool
					.promise()
					.execute<RowDataPacket[]>(
						"UPDATE `support_artist_db`.`subscriptions` SET `SubscriptionStatus` = ? WHERE UserName = ? AND ArtistName = ? AND SubscriptionName = ?",
						[1, username, artistname, subscriptionType]
					);
				return true;
			}

			return false;
		} catch (error) {
			console.error("Unexpected error in updateSubscriptionStatusByUsername:", error);
			throw new Error("Something went wrong (with the data layer)");
		}
	}

	public async getSubscriptionByCompositeKey(username: string, artistname: string, subscriptionType: string): Promise<Subscription> {
		try {
			const [results] = await pool.promise().query<RowDataPacket[]>(
				`SELECT UserName, ArtistName, SubscriptionName, StartDate, SubscriptionStatus
        FROM support_artist_db.subscriptions
        WHERE UserName = ? AND ArtistName = ? AND SubscriptionName = ?`,
				[username, artistname, subscriptionType]
			);
			return results[0] as Subscription;
		} catch (error) {
			console.error("Error fetching subscription:", error);
			throw new Error(`Error fetching subscription data for ${username}, ${artistname}, ${subscriptionType}`);
		}
	}
}
