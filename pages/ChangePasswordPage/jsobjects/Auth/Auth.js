export default {
  async SignInClicked() {
    try {
      const response = await Authenticate.run();
      console.log("Authenticate response:", response);

      if (response && response.length > 0) {
        const userInfo = response[0];

        // Store initial user data
        await storeValue("login_username", userInfo.username);
        await storeValue("role", userInfo.role);
        await storeValue("user_id", userInfo.user_id);

        console.log("Stored user_id:", appsmith.store.user_id);

        try {
          const res = await R_USER.run();
          console.log("R_USER response:", res);

          if (res && res.length > 0) {
            const userDetail = res[0];

            // Store additional values from R_USER
            await storeValue("division_id", userDetail.division_id);
            await storeValue("user_type_id", userDetail.user_type_id);
            await storeValue("name", userDetail.name);

            // Print all stored values
            console.log("All stored values:", appsmith.store);
            console.log("Stored division_id:", userDetail.division_id);
            console.log("Stored user_type_id:", userDetail.user_type_id);
            console.log("Stored name:", userDetail.name);

            // Show success alert
            showAlert(`\n\nการลงชื่อเข้าใช้สำเร็จ ยินดีต้อนรับ\n\n`, "success");

            // Navigate to Home Page (only after storing everything)
            navigateTo("Home Page");
          } else {
            console.log("R_USER returned no results");
            showAlert("ไม่พบข้อมูลผู้ใช้งานเพิ่มเติม");
          }
        } catch (err) {
          console.log("R_USER error:", err);
          showAlert("การลงชื่อเข้าใช้ผิดพลาด กรุณาตรวจสอบข้อมูลอีกครั้ง");
        }
      } else {
        showAlert("Username or Password is Incorrect");
      }
    } catch (error) {
      console.log("Authentication error:", error);
      showAlert("Something went wrong");
    }
  }
};
