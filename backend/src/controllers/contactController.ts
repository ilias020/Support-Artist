import express from "express";
import { Contact } from "../business/model/contact";
import { ContactService, ContactUpdateService } from "../business/service/contactService";
import { errorMessage } from "../util/errors";

export class ContactController {
	private _service: ContactService;

	constructor(service: ContactService) {
		this._service = service;
	}

	public async submitContact(req: express.Request, res: express.Response): Promise<void> {
		try {
			const message: string = req.body._message;
			const userName: string = req.body._username;
			const contact: Contact = new Contact(message, userName);

			await this._service.submitContact(contact);

			res.status(201).json({
				message: "Contact saved successfully",
				contact
			});
		} catch (error) {
			console.error(errorMessage(error));
			res.status(400).json({ error: errorMessage(error) });
		}
	}

	public async getContacts(_req: express.Request, res: express.Response): Promise<void> {
		try {
			const contacts = await this._service.fetchContacts();
			res.status(200).json({
				message: "Contacts fetched successfully",
				contacts: contacts
			});
		} catch (error) {
			console.error(errorMessage(error));
			res.status(400).json({ error: errorMessage(error) });
		}
	}
}

export class ContactUpdateController {
	private _service: ContactUpdateService;

	constructor(service: ContactUpdateService) {
		this._service = service;
	}

	public async updateMessageStatus(req: express.Request, res: express.Response): Promise<void> {
		try {
			const { formTime, username, messageStatus } = req.body;

			if (!formTime || !username || !messageStatus) {
				res.status(400).json({
					error: "formTime, username en messageStatus zijn verplicht."
				});
				return;
			}

			const validStatuses = ["Pending", "In progress", "Resolved"];
			if (!validStatuses.includes(messageStatus)) {
				res.status(400).json({
					error: `Ongeldige status. Geldige opties zijn: ${validStatuses.join(", ")}.`
				});
				return;
			}

			await this._service.updateMessageStatus(formTime, username, messageStatus);

			res.status(200).json({ message: "Berichtstatus succesvol bijgewerkt." });
		} catch (error) {
			console.error(errorMessage(error));
			res.status(500).json({ error: errorMessage(error) });
		}
	}
}
