export default {
    SignInClicked() {
        Authenticate.run()
            .then((response) => {
                console.log("Authenticate response:", response);

                if (response && response.length > 0) {
                    const userInfo = response[0];

                    // Store initial user data
                    storeValue("username", userInfo.username);
                    storeValue("role", userInfo.role);
                    storeValue("user_id", userInfo.user_id).then(() => {
                        console.log("Stored user_id:", appsmith.store.user_id);

                        // Run R_USER query
                        R_USER.run()
                            .then((res) => {
                                console.log("R_USER response:", res);

                                if (res && res.length > 0) {
                                    const userDetail = res[0];

                                    // Store additional values from R_USER
                                    storeValue("division_id", userDetail.division_id);
                                    storeValue("user_type_id", userDetail.user_type_id);
                                    storeValue("name", userDetail.name).then(() => {
                                        // Print all stored values
                                        console.log("All stored values:", appsmith.store);
                                    });

                                    console.log("Stored division_id:", userDetail.division_id);
                                    console.log("Stored user_type_id:", userDetail.user_type_id);
                                    console.log("Stored name:", userDetail.name);
                                } else {
                                    console.log("R_USER returned no results");
                                }
                            })
                            .catch((err) => {
                                console.log("R_USER error:", err);
                                showAlert("Failed to fetch user details");
                            });
                    });

                    // Navigate to Home Page
                    navigateTo("Home Page");
                } else {
                    showAlert("Username or Password is Incorrect");
                }
            })
            .catch((error) => {
                console.log("Authentication error:", error);
                showAlert("Something went wrong");
            });
    }
};
