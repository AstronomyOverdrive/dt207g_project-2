"use strict";

const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const infoBox = document.getElementById("info-box");
const loginDiv = document.getElementById("login");
const logoutDiv = document.getElementById("logout");

// Make login request
async function loginUser(apiUrl, extras) {
	const userName = usernameField.value;
	const passWord = passwordField.value;
	if (isNameValid(userName)) {
		try {
			const response = await fetch(
				"http://0.0.0.0:8000/staff/user/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						"username": userName,
						"password": passWord
					})
				}
			);
			const responseData = await response.json();
			if (response.status === 200) { // Successful login
				localStorage.setItem("JWT", responseData.token);
				window.location.href = "./";
			} else if (response.status === 401) {
				infoBox.textContent = "Ogiltigt lösenord";
			} else if (response.status === 404) {
				infoBox.textContent = "Användare finns inte";
			} else {
				infoBox.textContent = "Något gick fel, försök igen senare";
			}
		} catch (error) {
			console.error(error);
		}
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

// Show correct form inputs
function checkStatus() {
	const token = localStorage.getItem("JWT");
	if (!token) {
		logoutDiv.setAttribute("class", "hide");
		loginDiv.removeAttribute("class", "hide");
	} else {
		loginDiv.setAttribute("class", "hide");
		logoutDiv.removeAttribute("class", "hide");
	}
}

// Logout user
function logoutUser() {
	localStorage.removeItem("JWT");
	checkStatus();
}

// Event listeners
loginBtn.addEventListener("click", loginUser);
logoutBtn.addEventListener("click", logoutUser);
addEventListener("load", checkStatus);
