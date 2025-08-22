"use strict";

function checkToken() {
	if (!localStorage.getItem("JWT")) {
		window.location.href = "login.html";
	}
}

addEventListener("load", checkToken);
