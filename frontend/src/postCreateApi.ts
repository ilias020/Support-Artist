import { API_URL } from "./config.js";
import { Post } from "./post.js";

function displayError(message: string): void {
	const element: HTMLInputElement = document.getElementById("errorSection") as HTMLInputElement;

	const errorElement: HTMLElement = document.createElement("p");

	errorElement.innerText = message;

	element.appendChild(errorElement);
}

function getUploadData(): { post: Post; userName: string; userRole: string } {
	const descriptionElement: HTMLInputElement = document.getElementById("description") as HTMLInputElement;
	const userSessionData = localStorage.getItem("userSessionData");
	if (!userSessionData) {
		throw new Error("User session data not found.");
	}
	const parsedData = JSON.parse(userSessionData);

	const userName = parsedData._username;
	if (!userName) {
		throw new Error("Username not found in user session data.");
	}

	const userRole = parsedData._userRole;
	if (userRole !== "Artist") {
		alert("Only artists can create posts");
		throw new Error("User does not have the correct role");
	}

	return {
		post: new Post(descriptionElement.value),
		userName: userName,
		userRole: userRole
	};
}

function upload(event: Event): void {
	event.preventDefault();
	try {
		const { post, userName, userRole } = getUploadData();
		sendUploadRequest(post, userName, userRole);
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

async function sendUploadRequest(post: Post, userName: string, userRole: string): Promise<void> {
	const response = await fetch(`${API_URL}/posts`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ post, userName, userRole })
	});
	if (!response.ok) {
		const errorMessage = await response.json();
		throw new Error(errorMessage);
	}

	window.location.replace("profile.html");
}

function init(): void {
	const button: HTMLButtonElement = document.getElementById("uploadBttn") as HTMLButtonElement;

	button.addEventListener("click", upload);
}

init();
