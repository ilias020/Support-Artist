import { ResultSetHeader, RowDataPacket } from "mysql2";

import { Contact } from "../../business/model/contact";
import { pool } from "../../util/database";
import { errorMessage } from "../../util/errors";

export class ContactInsertMysql {
	public async insertContact(contact: Contact): Promise<Contact> {
		try {
			await pool
				.promise()
				.execute<ResultSetHeader>(
					"INSERT INTO `support_artist_db`.`contactforms` (`Message`,  `FormTime`, `UserName`, `MessageStatus`) VALUES (?,?,?,?);",
					[contact.message, contact.formTime, contact.username, contact.messageStatus]
				);

			return contact;
		} catch (error) {
			console.error("Fout bij het opslaan van contact:", errorMessage(error));
			throw new Error("Opslag van het contact is mislukt." + errorMessage(error));
		}
	}

	public async fetchContacts(): Promise<Contact[]> {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>("SELECT Message, FormTime, UserName, MessageStatus FROM contactforms ORDER BY FormTime DESC");

			const contacts = rows.map((row) => {
				const contact = new Contact(row.Message, row.UserName);
				contact["_formTime"] = new Date(row.FormTime);
				contact["_username"] = row.UserName;
				contact["_messageStatus"] = row.MessageStatus;
				return contact;
			});

			return contacts;
		} catch (error) {
			console.error("Fout bij het ophalen van contacten:", errorMessage(error));
			throw new Error("Fout bij het ophalen van contacten.");
		}
	}
}

export class ContactUpdateMysql {
	public async updateStatus(formTime: string, username: string, messageStatus: string): Promise<void> {
		try {
			const [result] = await pool
				.promise()
				.execute<ResultSetHeader>("UPDATE `support_artist_db`.`contactforms` SET MessageStatus = ? WHERE FormTime = ? AND UserName = ?;", [
					messageStatus,
					formTime,
					username
				]);

			if (result.affectedRows !== 1) {
				throw new Error(`Update mislukt. Controleer of een bericht met FormTime ${formTime} en UserName ${username} bestaat.`);
			}
		} catch (error) {
			console.error(`Fout bij het updaten van message status: ${errorMessage(error)}`);
			throw new Error(`Kan message status niet bijwerken: ${errorMessage(error)}`);
		}
	}
}
