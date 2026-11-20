import { ContactInsertMysql, ContactUpdateMysql } from "../../data/models/contactMysql";
import { Contact } from "../model/contact";

export class ContactService {
	private _data: ContactInsertMysql;

	constructor(data: ContactInsertMysql) {
		this._data = data;
	}

	public async submitContact(contact: Contact): Promise<Contact> {
		return await this._data.insertContact(contact);
	}

	public async fetchContacts(): Promise<Contact[]> {
		return await this._data.fetchContacts();
	}
}

export class ContactUpdateService {
	private _data: ContactUpdateMysql;

	constructor(data: ContactUpdateMysql) {
		this._data = data;
	}

	public async updateMessageStatus(formTime: string, username: string, messageStatus: string): Promise<void> {
		await this._data.updateStatus(formTime, username, messageStatus);
	}
}
