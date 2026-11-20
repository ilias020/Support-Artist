import { API_URL } from "./config.js";
import { Post } from "./post.js";

function displayError(message: string): void {
	const element: HTMLInputElement = document.getElementById("errorSection") as HTMLInputElement;

	const errorElement: HTMLElement = document.createElement("p");

	errorElement.innerText = message;

	element.appendChild(errorElement);
}

function fetch_(): void {
	try {
		const artistName = getFetchData();

		sendFetchRequest(artistName);
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

fetch_();

function getFetchData(): string {
	const artistNameElement: HTMLElement = document.getElementById("artistName") as HTMLElement;

	const artistName = artistNameElement.innerText.trim();
	if (!artistName) {
		throw new Error("Artist name not found.");
	}

	return artistName;
}

interface ResponsePostData {
	_description: string;
	_postTime: Date;
	_artistName: string;
}

async function sendFetchRequest(artistName: string): Promise<void> {
	const response = await fetch(`${API_URL}/posts?artistName=${encodeURIComponent(artistName)}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (!response.ok) {
		const errorMessage = await response.json();
		throw new Error(errorMessage);
	}

	const posts = await response.json();
	const postArr: Post[] = [];
	posts.forEach((post: ResponsePostData) => {
		const postTimeFormatted: Date = addHourToPostTime(post._postTime);
		postArr.push(new Post(post._description, postTimeFormatted, post._artistName));
	});

	displayPosts(postArr);
}

function addHourToPostTime(postTime: Date): Date {
	const postTimeFormatted = new Date(postTime);
	postTimeFormatted.setHours(postTimeFormatted.getHours() + 1);
	return postTimeFormatted;
}

function displayPosts(posts: Post[]): void {
	const postsContainer: HTMLElement = document.getElementById("postsContainer") as HTMLElement;

	postsContainer.innerHTML = "";

	posts.forEach((post) => {
		const postSection = document.createElement("section");

		postSection.className = "postSection";

		postSection.innerHTML = `
    <h1 class="postArtistName">${post.artistName}</h1>
    <button class="editBttn" data-description="${post.description}" data-postTime="${post.postTime}" data-artistName="${
			post.artistName
		}">Edit</button>
    <button class="deleteBttn" data-postTime="${post.postTime}" data-artistName="${post.artistName}">Delete</button>
    <br>
    <p class="description">${post.description}</p>
    <br>
    <p class="postTime">${new Date(post.postTime).toISOString().slice(0, 19).replace("T", " ")}</p>

    `;

		postsContainer.appendChild(postSection);
	});

	const editButtons = document.querySelectorAll(".editBttn");
	editButtons.forEach((button) => {
		button.addEventListener("click", (event) => handleEditButtonClick(event));
	});

	const deleteButtons = document.querySelectorAll(".deleteBttn");
	deleteButtons.forEach((button) => {
		button.addEventListener("click", (event) => handleDeleteButtonClick(event));
	});
}

function handleEditButtonClick(event: Event): void {
	const button = event.target as HTMLButtonElement;
	const description = button.dataset.description;
	const postTime = button.dataset.posttime;
	const artistName = button.dataset.artistname;

	window.location.href = `updatePosts.html?artistName=${artistName}&postTime=${postTime}&description=${description}`;
}

function handleDeleteButtonClick(event: Event): void {
	const button = event.target as HTMLButtonElement;
	const postTime = button.dataset.posttime;
	const artistName = button.dataset.artistname;
	const isConfirmed = window.confirm("Are you sure you want to delete this post?");

	if (isConfirmed) {
		try {
			if (postTime !== undefined && artistName !== undefined) {
				sendDeleteRequest(postTime, artistName);
			} else {
				throw new Error("Values can not be undefined");
			}

			const postSection = button.closest(".postSection");
			if (postSection) {
				postSection.remove();
			}

			alert("Post deleted successfully.");
		} catch (error) {
			console.error(error instanceof Error ? error.message : error);
			alert("Failed to delete post. Please try again.");
		}
	}
}

async function sendDeleteRequest(postTime: string, artistName: string): Promise<void> {
	const response = await fetch(`${API_URL}/posts?postTime=${encodeURIComponent(postTime)}&artistName=${encodeURIComponent(artistName)}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (!response.ok) {
		const errorMessage = await response.json();
		throw new Error(errorMessage);
	}
}
