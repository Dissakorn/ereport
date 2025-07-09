export default {
    // Create new user with temporary password
    async createUser() {
        try {
            const name = Input_Admin_Name.text;
            const email = Input_Admin_Email.text;
            const username = Input_Admin_Username.text;
            const tempPassword = Input_Admin_TempPassword.text;
            const divisionId = Select_Division.selectedOptionValue;
            const userTypeId = Select_UserType.selectedOptionValue;

            // Debug: Log all input values
            console.log("Debug - Input values:");
            console.log("name:", name);
            console.log("email:", email);
            console.log("username:", username);
            console.log("tempPassword:", tempPassword);
            console.log("divisionId:", divisionId);
            console.log("userTypeId:", userTypeId);

            // Check required fields (email is optional)
            if (!name || !username || !tempPassword) {
                showAlert("กรุณากรอก: ชื่อ-นามสกุล, ชื่อผู้ใช้, และรหัสผ่านชั่วคราว", "error");
                return;
            }

            if (divisionId === null || divisionId === undefined || divisionId === '') {
                showAlert("กรุณาเลือกแผนก", "error");
                return;
            }

            if (userTypeId === null || userTypeId === undefined || userTypeId === '') {
                showAlert("กรุณาเลือกประเภทผู้ใช้", "error");
                return;
            }

            // Validate email format if provided
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showAlert("รูปแบบอีเมลไม่ถูกต้อง", "error");
                return;
            }

            // Check if username exists
            await CheckUsernameExists.run();
            if (CheckUsernameExists.data[0].count > 0) {
                showAlert("ชื่อผู้ใช้นี้มีอยู่แล้ว", "error");
                return;
            }

            // Check if email exists (if provided)
            if (email) {
                await CheckEmailExists.run();
                if (CheckEmailExists.data[0].count > 0) {
                    showAlert("อีเมลนี้มีอยู่แล้ว", "error");
                    return;
                }
            }

            // Create simple hash for temporary password
            const tempHash = PasswordUtils.simpleHash(tempPassword);
            const tempSalt = "temp_salt_" + Date.now();

            console.log("Debug - About to create user with:");
            console.log("tempHash:", tempHash);
            console.log("tempSalt:", tempSalt);

            await CreateUser.run({
                name: name,
                email: email || null,
                username: username,
                tempPassword: tempPassword,
                tempHash: tempHash,
                tempSalt: tempSalt,
                divisionId: parseInt(divisionId), // Ensure it's a number
                userTypeId: parseInt(userTypeId)  // Ensure it's a number
            });

            showAlert("สร้างผู้ใช้สำเร็จ", "success");
            // Clear inputs
            resetWidget("Input_Admin_Name");
            resetWidget("Input_Admin_Email");
            resetWidget("Input_Admin_Username");
            resetWidget("Input_Admin_TempPassword");
            resetWidget("Select_Division");
            resetWidget("Select_UserType");

            // Refresh user list if you have it
            if (typeof GetAllUsers !== 'undefined') {
                await GetAllUsers.run();
            }

        } catch (error) {
            console.log("CreateUser error:", error);
            showAlert("เกิดข้อผิดพลาด: " + error.message, "error");
        }
    },

    // Load divisions for dropdown
    async loadDivisions() {
        try {
            await GetDivisions.run();
            return GetDivisions.data;
        } catch (error) {
            console.log("LoadDivisions error:", error);
            return [];
        }
    },

    // Load user types for dropdown
    async loadUserTypes() {
        try {
            await GetUserTypes.run();
            return GetUserTypes.data;
        } catch (error) {
            console.log("LoadUserTypes error:", error);
            return [];
        }
    }
};
