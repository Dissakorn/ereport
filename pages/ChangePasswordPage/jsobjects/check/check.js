export default {
	showStoredValues() {
		// Retrieve all stored values
		const loginUsername = appsmith.store.login_username;
		const userName = appsmith.store.name;
		const userRole = appsmith.store.role;
		const userCode = appsmith.store.code;

		// Format the values into a readable message
		const message = `
			Login Username: ${loginUsername}
			Name: ${userName}
			Role: ${userRole}
			Code: ${userCode}
		`;

		// Display the message using showAlert or console.log
		showAlert(message, "info");
		console.log(message);
	}
}
