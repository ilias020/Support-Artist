import { API_URL } from "./config.js";
import { User } from "./user.js";

interface ValidationError {
	id: string;
	message: string;
}

function validateInputs(): ValidationError[] {
	const validations = [
		{ id: "firstName", pattern: /^[a-zA-Z]+$/, message: "Fill in field. Only letters are allowed." },
		{ id: "lastName", pattern: /^[a-zA-Z]+$/, message: "Fill in field. Only letters are allowed." },
		{ id: "email", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Fill in valid email." },
		{ id: "userName", pattern: /.+/, message: "Please fill in field." },
		{ id: "password", pattern: /.+/, message: "Please fill in field." }
	];

	return validations.filter(({ id, pattern }) => !isValidField(id, pattern)).map(({ id, message }) => ({ id, message }));
}

function isValidField(id: string, pattern: RegExp): boolean {
	const input = document.getElementById(id) as HTMLInputElement;
	return input.value.trim() !== "" && pattern.test(input.value);
}

function clearErrors(): void {
	document.querySelectorAll(".error-message").forEach((el) => el.remove());
	(document.getElementById("errorSection") as HTMLElement).replaceChildren();
}

function displayFieldError(id: string, message: string): void {
	const errorElement = document.createElement("p");
	errorElement.id = `${id}Error`;
	errorElement.classList.add("error-message");
	errorElement.textContent = message;
	document.getElementById(`${id}Section`)?.appendChild(errorElement);
}

function displayError(message: string): void {
	const element = document.getElementById("errorSection") as HTMLElement;
	const errorElement = document.createElement("p");
	errorElement.innerText = message;
	element.appendChild(errorElement);
}

function getRegisterData(): User {
	const value = (id: string): string => (document.getElementById(id) as HTMLInputElement).value;
	return new User(value("userName"), value("email"), value("firstName"), value("lastName"), value("password"));
}

async function sendRegisterRequest(user: User): Promise<void> {
	const response = await fetch(`${API_URL}/user/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			username: user.username,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			password: user.password
		})
	});

	if (!response.ok) {
		const body = (await response.json()) as { error?: string };
		throw new Error(body.error ?? "Registration failed.");
	}

	window.location.replace("signin.html");
}

async function handleRegister(event: Event): Promise<void> {
	event.preventDefault();
	clearErrors();

	const errors = validateInputs();
	if (errors.length > 0) {
		errors.forEach(({ id, message }) => displayFieldError(id, message));
		return;
	}

	try {
		await sendRegisterRequest(getRegisterData());
	} catch (error) {
		displayError(error instanceof Error ? error.message : "An unknown error occurred.");
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const registerButton = document.getElementById("registerButton") as HTMLButtonElement;
	registerButton.addEventListener("click", (event) => void handleRegister(event));
});
