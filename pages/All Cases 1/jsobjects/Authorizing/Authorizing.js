export default {
	CheckAuthorization() {
		if (appsmith.store.login_username === undefined) {
			showAlert("Please sign-in first");
			navigateTo("Authen");

		}
	}
}