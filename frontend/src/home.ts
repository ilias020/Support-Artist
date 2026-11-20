const burgerMenu: HTMLButtonElement = document.getElementById("burgerMenu") as HTMLButtonElement;
const navBar: HTMLElement = document.getElementById("navBar") as HTMLElement;

burgerMenu.addEventListener("click", () => {
	navBar.classList.toggle("show");
});

const profile: HTMLElement = document.getElementById("profile") as HTMLElement;
const contactAdmin: HTMLElement = document.getElementById("contactAdmin") as HTMLElement;

const userSessionData = localStorage.getItem("userSessionData");
if (!userSessionData) {
	throw new Error("User session data not found.");
}
const parsedData = JSON.parse(userSessionData);

const userRole = parsedData._userRole;
if (userRole !== "Artist") {
	if (profile) {
		profile.style.display = "none";
	}
} else {
	if (profile) {
		profile.style.display = "block";
	}
}

if (userRole !== "Admin") {
	if (contactAdmin) {
		contactAdmin.style.display = "none";
	}
} else {
	if (contactAdmin) {
		contactAdmin.style.display = "block";
	}
}
