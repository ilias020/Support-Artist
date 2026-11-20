import { API_URL } from "./config.js";

const addSubscribtion = async (username: string, artistname: string, subscriptionType: string): Promise<Response> => {
	try {
		const response = await fetch(`${API_URL}/subscription`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username, artistname, subscriptionType })
		});
		return response;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const modal = document.getElementById("modal") as HTMLElement;
const idealButton = document.getElementById("idealButton") as HTMLButtonElement;
const closeModalButton = document.getElementById("closeModal") as HTMLButtonElement;

idealButton.addEventListener("click", () => {
	modal.classList.remove("hidden");
});

closeModalButton.addEventListener("click", () => {
	modal.classList.add("hidden");
});

const nameOnCardInput = document.getElementById("nameOnCardInput") as HTMLInputElement;
const cardNumberInput = document.getElementById("cardNumberInput") as HTMLInputElement;
const expiringDateInput = document.getElementById("expringDateInput") as HTMLInputElement;
const CVVInput = document.getElementById("CVVInput") as HTMLInputElement;

const nameOnCardPar = document.getElementById("nameOnCardPar") as HTMLElement;
const cardNumberPar = document.getElementById("cardNumberPar") as HTMLElement;
const expiringDatePar = document.getElementById("expiringDatePar") as HTMLElement;
const CVVPar = document.getElementById("CVVPar") as HTMLElement;

const subscriptionType = document.getElementById("subscriptionType") as HTMLElement;

document.getElementById("payButton")?.addEventListener("click", (event) => {
	event.preventDefault();

	const localHostInfo = getLocalStorageInfo();

	let isValid = true;
	isValid = validateField(nameOnCardInput, nameOnCardPar, isValid);
	isValid = validateCardNumber(cardNumberInput, cardNumberPar, isValid);
	isValid = validateExpiringDate(expiringDateInput, expiringDatePar, isValid);
	isValid = validateCVV(CVVInput, CVVPar, isValid);

	if (isValid) {
		handleSubscription(localHostInfo);
	}
});

localStorage.setItem("ArtistSessionData", JSON.stringify({ _artistname: "artiest01" }));

function getLocalStorageInfo(): { username: string; artistname: string } {
	const userSessionData = localStorage.getItem("userSessionData");
	const artistSessionData = localStorage.getItem("ArtistSessionData");

	if (!userSessionData) {
		throw new Error("User session data not found in localStorage.");
	}
	if (!artistSessionData) {
		throw new Error("Artist session data not found in localStorage.");
	}

	const parsedUserData = JSON.parse(userSessionData);
	const parsedArtistData = JSON.parse(artistSessionData);

	return {
		username: parsedUserData._username,
		artistname: parsedArtistData._artistname
	};
}

function validateField(input: HTMLInputElement | null, errorPar: HTMLElement | null, isValid: boolean): boolean {
	if (input && input.value.trim()) {
		errorPar?.classList.add("hidden");
		return isValid;
	} else {
		errorPar?.classList.remove("hidden");
		return false;
	}
}

function validateCardNumber(input: HTMLInputElement | null, errorPar: HTMLElement | null, isValid: boolean): boolean {
	const cardNumber = input?.value.replace(/\s/g, "");
	if (!cardNumber || cardNumber.length < 16 || cardNumber.length > 19) {
		errorPar?.classList.remove("hidden");
		return false;
	} else {
		errorPar?.classList.add("hidden");
		return isValid;
	}
}

function validateExpiringDate(input: HTMLInputElement | null, errorPar: HTMLElement | null, isValid: boolean): boolean {
	const expiringDate = input?.value;
	if (expiringDate?.length !== 5) {
		errorPar?.classList.remove("hidden");
		return false;
	} else {
		errorPar?.classList.add("hidden");
		return isValid;
	}
}

function validateCVV(input: HTMLInputElement | null, errorPar: HTMLElement | null, isValid: boolean): boolean {
	const CVV = input?.value;
	if (!CVV || CVV.length !== 3) {
		errorPar?.classList.remove("hidden");
		return false;
	} else {
		errorPar?.classList.add("hidden");
		return isValid;
	}
}

function handleSubscription(localHostInfo: { username: string; artistname: string }): void {
	addSubscribtion(localHostInfo.username, localHostInfo.artistname, subscriptionType.innerHTML)
		.then((data) => {
			if (data.status === 201) {
				window.location.href = "confirm-page.html";
			} else {
				window.location.href = "reject-page.html";
			}
		})
		.catch((error) => {
			console.error("Error during subscription:", error);
		});
}

document.addEventListener("DOMContentLoaded", () => {
	const subscriptionForm = document.getElementById("subscriptionForm") as HTMLFormElement;
	const subscriptionType = document.getElementById("subscriptionType") as HTMLElement;
	const subscriptionPrice = document.getElementById("subscriptionPrice") as HTMLElement;

	subscriptionForm.addEventListener("change", () => {
		const selectedOption = subscriptionForm.querySelector('input[name="subscription"]:checked') as HTMLInputElement;
		if (selectedOption) {
			subscriptionType.textContent = selectedOption.value;
			subscriptionPrice.textContent = `${selectedOption.dataset.price}`;
		}
	});
});
