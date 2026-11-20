import { API_URL } from "./config.js";

interface Subscription {
	username: string;
	artistname: string;
	SubscriptionName: string;
	StartDate: string;
	SubscriptionStatus: number;
	price: number;
}

const refreshButton = document.getElementById("refresh-button") as HTMLButtonElement;
const container = document.getElementById("subscriptions-container") as HTMLElement;

function createSubscriptionCard(subscription: Subscription): HTMLElement {
	const article = document.createElement("article");

	const header = document.createElement("header");
	const title = document.createElement("h3");
	title.textContent = subscription.SubscriptionName;
	header.appendChild(title);
	article.appendChild(header);

	const artistName = document.createElement("p");
	artistName.textContent = `Subscribed for: ${subscription.artistname}`;
	article.appendChild(artistName);

	const startDate = document.createElement("p");
	startDate.textContent = `Start Date: ${new Date(subscription.StartDate).toLocaleDateString()}`;
	article.appendChild(startDate);

	const status = document.createElement("p");
	status.textContent = `Status: ${subscription.SubscriptionStatus === 1 ? "Active" : "Inactive"}`;
	article.appendChild(status);

	const price = document.createElement("p");
	price.textContent = `Price: $${subscription.price.toFixed(2)}`;
	article.appendChild(price);

	return article;
}

async function refreshSubscriptions(): Promise<void> {
	const userSessionData = localStorage.getItem("userSessionData");
	const artistSessionData = localStorage.getItem("ArtistSessionData");

	if (!userSessionData) {
		console.error("User session data not found in localStorage.");
		container.innerHTML = "<p>Failed to load subscriptions. Missing user session data.</p>";
		return;
	}

	if (!artistSessionData) {
		console.error("Artist session data not found in localStorage.");
		container.innerHTML = "<p>Failed to load subscriptions. Missing artist session data.</p>";
		return;
	}

	const parsedUserSession = JSON.parse(userSessionData);

	if (!parsedUserSession._username) {
		console.error("Username is missing in user session data.");
		container.innerHTML = "<p>Failed to load subscriptions. Missing username.</p>";
		return;
	}

	try {
		const response = await fetch(`${API_URL}/subscription/${parsedUserSession._username}`);
		if (!response.ok) {
			throw new Error(`Error fetching subscriptions: ${response.statusText}`);
		}
		const subscriptions: Subscription[] = await response.json();
		container.innerHTML = "";

		if (subscriptions.length === 0) {
			container.innerHTML = "<p>No subscriptions found for this user.</p>";
			return;
		}

		subscriptions.forEach((subscription) => {
			const article = createSubscriptionCard(subscription);
			container.appendChild(article);
		});
	} catch (error) {
		console.error("Error refreshing subscriptions:", error);
		container.innerHTML = "<p>Failed to load subscriptions. Please try again later.</p>";
	}
}

refreshButton.addEventListener("click", refreshSubscriptions);
