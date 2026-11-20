import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", function (): void {
	const userRole = localStorage.getItem("role");
	if (userRole !== "admin") {
		throw new Error("You do not have permission to access this page.");
	}

	const urlParams = new URLSearchParams(window.location.search);
	const messageId = urlParams.get("messageId");
	const messageContent = urlParams.get("message");
	const currentStatus = urlParams.get("status");
	const formTime = urlParams.get("formTime");
	const username = urlParams.get("username");

	if (!messageId || !messageContent || !currentStatus || !formTime || !username) {
		throw new Error("Message ID, content, status, formTime, or username is missing.");
	}

	const messageElement = document.getElementById("message") as HTMLElement;
	const statusElement = document.getElementById("status") as HTMLSelectElement;

	messageElement.innerText = messageContent;

	statusElement.value = currentStatus;

	init();
});

function displayError(message: string): void {
	const element = document.getElementById("errorSection") as HTMLElement;
	const errorElement = document.createElement("p");
	errorElement.innerText = message;
	element.appendChild(errorElement);
}

function init(): void {
	const button = document.getElementById("updateBttn") as HTMLButtonElement;
	button.addEventListener("click", update);
}

async function update(): Promise<void> {
	try {
		const updatedStatus = getUpdatedStatus();
		const messageId = new URLSearchParams(window.location.search).get("messageId");

		await sendUpdateRequest(messageId, updatedStatus);

		window.location.replace("contactAdmin.html");
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

function getUpdatedStatus(): {
	formTime: string;
	username: string;
	messageStatus: string;
} {
	const statusElement = document.getElementById("status") as HTMLSelectElement;
	const newStatus = statusElement.value;

	const urlParams = new URLSearchParams(window.location.search);
	const formTime = urlParams.get("formTime");
	const username = urlParams.get("username");

	if (!newStatus || !formTime || !username) {
		throw new Error("FormTime, Username, or Status is missing.");
	}

	return {
		formTime,
		username,
		messageStatus: newStatus
	};
}

async function sendUpdateRequest(
	messageId: string | null,
	updatedStatus: { formTime: string; username: string; messageStatus: string }
): Promise<void> {
	if (!messageId) {
		throw new Error("Message ID is missing.");
	}

	const response = await fetch(`${API_URL}/contact`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(updatedStatus)
	});

	if (!response.ok) {
		const errorMessage = await response.json();
		throw new Error(errorMessage.error || "Failed to update status.");
	}
}
