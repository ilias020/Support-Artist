import { API_URL } from "./config.js";
import { Contact } from "./contact_form.js";

function displayError(message: string): void {
	const element: HTMLElement = document.getElementById("errorSection") as HTMLElement;
	if (!element) {
		console.error("Error section not found in the DOM.");
		return;
	}
	const errorElement: HTMLElement = document.createElement("p");
	errorElement.innerText = message;
	element.appendChild(errorElement);
}

function getContactData(): Contact {
	const messageElement: HTMLInputElement = document.getElementById("message") as HTMLInputElement;
	if (!messageElement) throw new Error("Message input field not found.");
	const userSessionData = localStorage.getItem("userSessionData");
	if (!userSessionData) throw new Error("User session data not found.");
	const parsedData = JSON.parse(userSessionData);
	const username = parsedData._username;
	if (!username) throw new Error("Username not found in user session data.");
	const userRole = parsedData._userRole;
	if (userRole !== "User" && userRole !== "Artist") {
		alert("Only users and artists can send messages");
		throw new Error("User does not have the correct role");
	}
	const contact: Contact = new Contact(messageElement.value, username);
	return contact;
}

function submitContact(): void {
	try {
		const contact = getContactData();
		sendPostRequest(contact);
	} catch (error) {
		if (error instanceof Error) {
			displayError(error.message);
			console.error(error.message);
		} else {
			displayError("An unknown error occurred.");
			console.error("An unknown error occurred.");
		}
	}
}

async function sendPostRequest(contact: Contact): Promise<Response> {
	const response = await fetch(`${API_URL}/contact`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(contact)
	});
	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}
	return response;
}

function init(): void {
	const button: HTMLButtonElement = document.getElementById("submitBttn") as HTMLButtonElement;
	if (!button) {
		console.error("Submit button not found in the DOM.");
		return;
	}
	button.addEventListener("click", submitContact);
}

init();
