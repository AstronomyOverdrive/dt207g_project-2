"use strict";

const menuDiv = document.getElementById("menu");
const infoBox = document.getElementById("info-box");
const modeCheck = document.getElementById("edit");
const editId = document.getElementById("id");
const dishName = document.getElementById("name");
const dishDesc = document.getElementById("description");
const dishPrice = document.getElementById("price");
const updateBtn = document.getElementById("update-btn");

let token = "";

// Make fetch calls
async function makeApiCall(apiUrl, extras) {
	try {
		const response = await fetch(apiUrl, extras);
		const responseData = await response.json();
		if (response.status === 200  || response.status === 201) { // Succesful menu fetch
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
		let dishName = document.createElement("h4");
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

// Add to menu or update menu items
async function updateMenu() {
	const itemName = dishName.value;
	const itemDesc = dishDesc.value;
	const itemPrice = dishPrice.value;
	const itemId = editId.value;
	const editMode = modeCheck.checked;
	// Basic validation
	if (itemName !== "" && itemDesc !== "" && itemPrice !== "") {
		if (itemName.length <= 25) {
			if (itemDesc.length <= 120) {
				if (editMode) { // Edit existing item
					// Make request to edit menu item
					await makeApiCall(
						"http://0.0.0.0:8000/staff/menu/edit",
						{
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
								"Authorization": "Bearer " + token
							},
							body: JSON.stringify({
								"name": itemName,
								"description": itemDesc,
								"price": Number(itemPrice),
								"id": itemId
							})
						}
					);
				} else { // Create new item
					// Make request to add menu item
					await makeApiCall(
						"http://0.0.0.0:8000/staff/menu/add",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Authorization": "Bearer " + token
							},
							body: JSON.stringify({
								"name": itemName,
								"description": itemDesc,
								"price": Number(itemPrice)
							})
						}
					);
				}
			} else {
				infoBox.textContent = "Beskrivning kan max vara 120 tecken";
			}
		} else {
			infoBox.textContent = "Namn kan max vara 25 tecken";
		}
	} else {
		infoBox.textContent = "Alla fällt måste fyllas i";
	}
	// Clear form inputs
	dishName.value = "";
	dishDesc.value = "";
	dishPrice.value = "";
	editId.value = "";
	modeCheck.checked = false;
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

updateBtn.addEventListener("click", updateMenu);
addEventListener("load", setupPage);
