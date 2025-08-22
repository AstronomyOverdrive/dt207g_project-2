"use strict";

const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");
const registerBtn = document.getElementById("register-btn");
const infoBox = document.getElementById("info-box");
let token = "";

// Make fetch calls
async function makeApiCall(apiUrl, extras) {
	try {
		const response = await fetch(apiUrl, extras);
		const responseData = await response.json();
		if (response.status === 200) { // Valid token
			return responseData;
		} else if (response.status === 401 || response.status === 403) { // No token or invalid token
			infoBox.innerHTML = "Ogiltig behörighet, testa att <a href='login.html'>logga in</a> på nytt";
		} else if (response.status === 409) {
			infoBox.textContent = "Användare finns redan";
		} else {
		 	// Unsuccesful response
			infoBox.textContent = "Någonting gick fel, försök igen senare";
		}
	} catch (error) {
		console.error(error);
	}
}

// Basic validation
function isNameValid(name) {
	const trimmedName = name.replaceAll(" ", "").length;
	if (trimmedName > 4 && trimmedName < 26) {
		return true;
	} else {
		infoBox.textContent = "Användarnamn måste vara 5-25 karaktärer långt";
		return false;
	}
}

// Register new staff user
async function registerUser() {
	const userName = usernameField.value;
	const passWord = passwordField.value;
	if (isNameValid(userName)) {
		await makeApiCall(
			"http://0.0.0.0:8000/staff/user/register",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + token
				}
			}
		);
	}
}

// Set JWT token for later use
function setToken() {
	if (token === "") {
		token = localStorage.getItem("JWT");
	}
}

registerBtn.addEventListener("click", registerUser);
addEventListener("load", setToken);
