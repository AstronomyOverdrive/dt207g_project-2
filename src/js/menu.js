"use strict";

const menuDiv = document.getElementById("menu");
const infoBox = document.getElementById("info-box");
let token = "";

// Make fetch calls
async function makeApiCall(apiUrl, extras) {
	try {
		const response = await fetch(apiUrl, extras);
		const responseData = await response.json();
		if (response.status === 200) { // Succesful menu fetch
			return responseData;
		} else { // Unsuccesful fetch call
			infoBox.textContent = "Något gick fel, försök igen senare";
		}
	} catch (error) {
		console.error(error);
	}
}

// Add menu items, textContent and innerText is used to prevent XSS attacks
function populateMenu(data) {
	menuDiv.innerHTML = "";
	data.forEach(item => {
		// Clear menu div
		// Create div for menu item
		let menuItem = document.createElement("div");
		// Create header for item title
		let dishName = document.createElement("h3");
		dishName.textContent = `${item.name} - ${item.price}:-`;
		// Create paragraph for item decription
		let dishDescription = document.createElement("p");
		dishDescription.innerText = item.description; // innerText converts \n to <br> which textContent doesn't
		// Create span for item id
		let dishId = document.createElement("span");
		dishId.textContent = `Id: ${item._id}`;
		// Create button to add item to order
		let delButton = document.createElement("button");
		delButton.textContent = "Ta bort";
		delButton.addEventListener("click", () => {
			deleteItem(item._id);
		});
		// Append elements to menu item
		menuItem.appendChild(dishName);
		menuItem.appendChild(dishDescription);
		menuItem.appendChild(dishId);
		menuItem.appendChild(delButton);
		// Append menu item to container div
		menuDiv.appendChild(menuItem);
	});
}

// Delete item from menu
async function deleteItem(id) {
	// Make request to delete menu item
	await makeApiCall(
		"http://0.0.0.0:8000/staff/menu/delete",
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + token
			},
			body: JSON.stringify({
				"id": id
			})
		}
	);
	// Refresh menu on page
	setupPage();
}

// Request menu items
async function setupPage() {
	// Set JWT token for later use
	if (token === "") {
		token = localStorage.getItem("JWT");
	}
	const menuItems = await makeApiCall(
		"http://0.0.0.0:8000/public/menu",
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		}
	);
	populateMenu(menuItems);
}

addEventListener("load", setupPage);
