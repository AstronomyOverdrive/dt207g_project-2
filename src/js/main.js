"use strict";

const listElement = document.getElementById("orders");
let menuItems = [];

// Make fetch calls
async function makeApiCall(apiUrl, extras) {
	try {
		const response = await fetch(apiUrl, extras);
		const responseData = await response.json();
		if (response.status === 200) { // Valid token
			return responseData;
		} else if (response.status === 401 || response.status === 403) { // No token or invalid token
			listElement.innerHTML = "<li>Ogiltig behörighet, testa att <a href='login.html'>logga in</a> på nytt</li>";
		} else { // Unsuccesful response
			listElement.innerHTML = "<li>Någonting gick fel, försök igen senare</li>";
		}
	} catch (error) {
		console.error(error);
	}
}

// Request current orders
async function requestOrders() {
	if (menuItems.length === 0) { // Check if menu items have already been loaded
		// Get menu items for dish information
		menuItems = await makeApiCall(
			"http://0.0.0.0:8000/public/menu",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			}
		);
	}
	// Check if a token is stored
	const token = localStorage.getItem("JWT");
	if (token) {
		// Get all orders
		const orders = await makeApiCall(
			"http://0.0.0.0:8000/staff/orders/get",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + token
				}
			}
		);
		orders.forEach(order => {
			if (!order.completed) { // Only display active orders
				// Get name of ordered items
				let items = "";
				order.items.forEach(item => {
					const information = menuItems.find(dish => dish._id === item);
					items += `\n${information.name}`;
				});
				// Create a list item for the order
				const listItem = document.createElement("li");
				// Create a button to mark order complete
				const markBtn = document.createElement("button");
				markBtn.textContent = "Klar";
				markBtn.addEventListener("click", () => {
					markAsComplete(order._id);
				});
				// Set list item text
				listItem.innerText = `Beställning: ${items}

				Beställt av:
				${order.customerName}
				${order.customerPhone}

				Vid: ${order.createdAt.split(".")[0].replace("T", " ")}
				Id: ${order._id}`;
				// Append button to list item
				listItem.appendChild(markBtn);
				// Append list item to list element
				listElement.appendChild(listItem);
			}
		});
	}
}

addEventListener("load", requestOrders);
