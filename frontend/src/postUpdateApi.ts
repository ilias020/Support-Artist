import { API_URL } from "./config.js";
import { Post } from "./post.js";

document.addEventListener("DOMContentLoaded", function (): void {
	const urlParams = new URLSearchParams(window.location.search);
	const artistName = urlParams.get("artistName");
	const postTime = urlParams.get("postTime");
	const description = urlParams.get("description");
	if (!artistName) {
		throw new Error("Artist name is missing or invalid.");
	}
	if (!postTime) {
		throw new Error("Post time is missing or invalid.");
	}
	if (!description) {
		throw new Error("Description is missing or invalid.");
	}

	const artistNameElement = document.getElementById("artistName") as HTMLElement;
	const postTimeElement = document.getElementById("postTime") as HTMLElement;
	const descriptionElement = document.getElementById("description") as HTMLInputElement;

	artistNameElement.innerText = artistName;
	const postTimeDate = new Date(postTime);
	postTimeDate.setHours(postTimeDate.getHours() - 1);
	const formattedPostTime = postTimeDate.toISOString().slice(0, 19).replace("T", " ");
	postTimeElement.innerText = formattedPostTime;
	descriptionElement.value = description;
});

function displayError(message: string): void {
	const element: HTMLInputElement = document.getElementById("errorSection") as HTMLInputElement;

	const errorElement: HTMLElement = document.createElement("p");

	errorElement.innerText = message;

	element.appendChild(errorElement);
}

function init(): void {
	const button: HTMLButtonElement = document.getElementById("updateBttn") as HTMLButtonElement;

	button.addEventListener("click", update);
}

init();

function update(): void {
	try {
		const post = getUpdateData();
		sendUpdateRequest(post);
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

function getUpdateData(): Post {
	const artistNameElement: HTMLElement = document.getElementById("artistName") as HTMLElement;
	const postTimeElement: HTMLElement = document.getElementById("postTime") as HTMLElement;
	const descriptionElement: HTMLInputElement = document.getElementById("description") as HTMLInputElement;

	const artistName = artistNameElement.innerText.trim();
	const postTimeString = postTimeElement.innerText.trim();
	const description = descriptionElement.value.trim();

	if (!artistName || !postTimeString || !description) {
		throw new Error("All fields (Artist Name, Post Time, and Description) must be filled.");
	}

	const postTime = new Date(postTimeString);

	return new Post(description, postTime, artistName);
}

async function sendUpdateRequest(post: Post): Promise<void> {
	const response = await fetch(`${API_URL}/posts`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(post)
	});

	if (!response.ok) {
		const errorMessage = await response.json();
		throw new Error(errorMessage);
	}

	window.location.replace("profile.html");
}
