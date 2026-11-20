import { API_URL } from "./config.js";
import { UserSession } from "./userSession.js";

function displayError(message: string): void {
	const element: HTMLInputElement = document.getElementById("errorSection") as HTMLInputElement;

	const errorElement: HTMLElement = document.createElement("p");

	errorElement.innerText = message;

	element.appendChild(errorElement);
}

function init(): void {
	const button: HTMLButtonElement = document.getElementById("signinBttn") as HTMLButtonElement;

	button.addEventListener("click", signin);
}

init();

function signin(): void {
	try {
		const userSession: UserSession = getSigninData();

		sendSigninRequest(userSession);
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

function getSigninData(): UserSession {
	const userNameElement: HTMLTextAreaElement = document.getElementById("userName") as HTMLTextAreaElement;
	const passwordElement: HTMLTextAreaElement = document.getElementById("password") as HTMLTextAreaElement;
	return new UserSession(userNameElement.value, passwordElement.value);
}

async function sendSigninRequest(userSession: UserSession): Promise<void> {
	const response = await fetch(`${API_URL}/userSessions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(userSession)
	});

	if (!response.ok) {
		const errorMessage = await response.json();
		displayError(errorMessage);
		throw new Error(errorMessage || "No error message returned");
	}

	const data = await response.json();
	localStorage.setItem("userSessionData", JSON.stringify(data.userSessionData));
	localStorage.setItem("token", data.token);

	window.location.replace("home.html");
}
