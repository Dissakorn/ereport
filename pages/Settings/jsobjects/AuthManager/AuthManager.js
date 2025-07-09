export default {
    // Login with username/password
    async login() {
        try {
            if (!Input_Username.text || !Input_Password.text) {
                showAlert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน", "error");
                return;
            }

            // Get user data
            await GetUser.run();
            
            if (GetUser.data.length === 0) {
                showAlert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", "error");
                return;
            }

            const user = GetUser.data[0];
            let isValidPassword = false;

            // Check if temporary password
            if (user.is_temp_password) {
                // Simple comparison for temp passwords
                isValidPassword = (PasswordUtils.simpleHash(Input_Password.text) === user.password_hash);
            } else {
                // Full hash verification for permanent passwords
                isValidPassword = await PasswordUtils.verifyPassword(
                    Input_Password.text,
                    user.password_hash,
                    user.salt
                );
            }

            if (!isValidPassword) {
                showAlert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", "error");
                return;
            }

            // Store user session - matching your current storage pattern
            await storeValue("login_username", user.username);
            await storeValue("user_id", user.user_id);
            await storeValue("division_id", user.division_id);
            await storeValue("user_type_id", user.user_type_id);
            await storeValue("name", user.name);
            await storeValue("email", user.email);
            
            // Store additional user info for the auth system
            await storeValue("currentUser", {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                username: user.username,
                division_id: user.division_id,
                user_type_id: user.user_type_id,
                division_name: user.division_name,
                type_name: user.type_name,
                isFirstLogin: user.is_first_login,
                isTempPassword: user.is_temp_password
            });

            // Log stored values (matching your pattern)
            console.log("All stored values:", appsmith.store);
            console.log("Stored user_id:", user.user_id);
            console.log("Stored division_id:", user.division_id);
            console.log("Stored user_type_id:", user.user_type_id);
            console.log("Stored name:", user.name);

            // Check if password change is required
            if (user.is_first_login || user.is_temp_password) {
                showAlert("กรุณาเปลี่ยนรหัสผ่านใหม่", "warning");
                navigateTo("ChangePasswordPage");
            } else {
                showAlert(`\n\nการลงชื่อเข้าใช้สำเร็จ ยินดีต้อนรับ\n\n`, "success");
                navigateTo("Home Page"); // Changed to match your navigation
            }

        } catch (error) {
            console.log("Authentication error:", error);
            showAlert("เกิดข้อผิดพลาด: " + error.message, "error");
        }
    },

    // Change password (first time or regular change)
    async changePassword() {
        try {
            const currentPassword = Input_CurrentPassword.text;
            const newPassword = Input_NewPassword.text;
            const confirmPassword = Input_ConfirmPassword.text;

            // Validate inputs
            if (!currentPassword || !newPassword || !confirmPassword) {
                showAlert("กรุณากรอกข้อมูลให้ครบถ้วน", "error");
                return;
            }

            // Check password confirmation
            if (newPassword !== confirmPassword) {
                showAlert("รหัสผ่านใหม่ไม่ตรงกัน", "error");
                return;
            }

            // Validate new password
            const validation = PasswordUtils.validateNewPassword(newPassword);
            if (!validation.valid) {
                showAlert(validation.message, "error");
                return;
            }

            // Get current user data
            await GetUser.run();
            const user = GetUser.data[0];

            // Verify current password
            let isCurrentPasswordValid = false;
            if (user.is_temp_password) {
                isCurrentPasswordValid = (PasswordUtils.simpleHash(currentPassword) === user.password_hash);
            } else {
                isCurrentPasswordValid = await PasswordUtils.verifyPassword(
                    currentPassword,
                    user.password_hash,
                    user.salt
                );
            }

            if (!isCurrentPasswordValid) {
                showAlert("รหัสผ่านปัจจุบันไม่ถูกต้อง", "error");
                return;
            }

            // Generate new salt and hash
            const newSalt = PasswordUtils.generateSalt();
            const newHash = await PasswordUtils.hashPassword(newPassword, newSalt);

            // Update password in database
            await UpdatePassword.run({
                newHash: newHash,
                newSalt: newSalt,
                userId: user.user_id
            });

            // Update session after password change
            await storeValue("currentUser", {
                ...appsmith.store.currentUser,
                isFirstLogin: false,
                isTempPassword: false
            });

            showAlert("เปลี่ยนรหัสผ่านสำเร็จ", "success");
            navigateTo("Home Page"); // Changed to match your navigation

        } catch (error) {
            showAlert("เกิดข้อผิดพลาด: " + error.message, "error");
        }
    },

    // Logout
    logout() {
        // Clear all stored values (matching your storage pattern)
        removeValue("login_username");
        removeValue("user_id");
        removeValue("division_id");
        removeValue("user_type_id");
        removeValue("name");
        removeValue("email");
        removeValue("role");
        removeValue("currentUser");
        
        navigateTo("LoginPage");
        showAlert("ออกจากระบบสำเร็จ", "info");
    },

    // Check authentication
    checkAuth() {
        if (!appsmith.store.currentUser && !appsmith.store.user_id) {
            navigateTo("LoginPage");
            return false;
        }
        return true;
    }
};
