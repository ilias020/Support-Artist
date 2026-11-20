import { API_URL } from "./config.js";

export interface ContactMessage {
	_username: string;
	_message: string;
	_formTime: string;
	_messageStatus: string;
}

interface ContactResponse {
	message: string;
	contacts: ContactMessage[];
}

export async function fetchContacts(): Promise<ContactMessage[]> {
	const response = await fetch(`${API_URL}/contact`, {
		method: "GET",
		headers: { "Content-Type": "application/json" }
	});
	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}

	const data = (await response.json()) as ContactResponse;
	return data.contacts;
}
