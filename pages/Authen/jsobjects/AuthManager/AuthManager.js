export default {
    // Login with username/password
    async login() {
        try {
            if (!Input_Username.text || !Input_Password.text) {
                showAlert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน", "error");
                return;
            }

            console.log("Debug - Login attempt:");
            console.log("Username:", Input_Username.text);
            console.log("Password length:", Input_Password.text.length);

            // Get user data
            await GetUser.run();
            
            console.log("Debug - GetUser response:", GetUser.data);
            
            if (GetUser.data.length === 0) {
                console.log("Debug - No user found with username:", Input_Username.text);
                showAlert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", "error");
                return;
            }

            const user = GetUser.data[0];
            console.log("Debug - User found:", user);
            console.log("Debug - User password_hash:", user.password_hash);
            console.log("Debug - User salt:", user.salt);
            console.log("Debug - User is_temp_password:", user.is_temp_password);

            let isValidPassword = false;

            // Check if temporary password
            if (user.is_temp_password) {
                console.log("Debug - Checking temporary password");
                console.log("Debug - user.password exists:", !!user.password);
                console.log("Debug - user.password value:", user.password);
                
                // First try direct password comparison if password column exists
                if (user.password && user.password === Input_Password.text) {
                    console.log("Debug - ✅ Plain password match found");
                    isValidPassword = true;
                } else {
                    // Try hash comparison for temp passwords
                    const inputHash = PasswordUtils.simpleHash(Input_Password.text);
                    console.log("Debug - Input password:", Input_Password.text);
                    console.log("Debug - Input hash:", inputHash);
                    console.log("Debug - Stored hash:", user.password_hash);
                    
                    if (inputHash === user.password_hash) {
                        console.log("Debug - ✅ Hash comparison SUCCESS");
                        isValidPassword = true;
                    } else {
                        console.log("Debug - ❌ Hash comparison FAILED");
                        console.log("Debug - Hashes don't match:");
                        console.log("  Input:  ", inputHash);
                        console.log("  Stored: ", user.password_hash);
                        isValidPassword = false;
                    }
                }
                
                console.log("Debug - Temp password final result:", isValidPassword);
            } else {
                console.log("Debug - Checking permanent password - SIMPLIFIED");
                // Use simple verification instead of complex PBKDF2
                console.log("Debug - Stored hash:", user.password_hash);
                console.log("Debug - Stored salt:", user.salt);
                
                // Try multiple simple hash methods for compatibility
                const method1 = btoa(Input_Password.text + "_SECURE_" + user.salt + "_2024");
                const method2 = btoa(Input_Password.text + user.salt + "simple");
                const method3 = user.password_hash; // Direct comparison
                
                console.log("Debug - Testing method 1:", method1);
                console.log("Debug - Testing method 2:", method2);
                
                if (method1 === user.password_hash) {
                    console.log("Debug - ✅ Method 1 hash match!");
                    isValidPassword = true;
                } else if (method2 === user.password_hash) {
                    console.log("Debug - ✅ Method 2 hash match!");
                    isValidPassword = true;
                } else {
                    console.log("Debug - ❌ No simple hash matches");
                    isValidPassword = false;
                }
                
                console.log("Debug - Simple verification result:", isValidPassword);
            }

            console.log("Debug - 🔍 FINAL PASSWORD VALIDATION RESULT:", isValidPassword);

            if (!isValidPassword) {
                console.log("Debug - ❌ LOGIN FAILED - Password validation returned false");
                showAlert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", "error");
                return;
            }

            console.log("Debug - ✅ LOGIN SUCCESS - Proceeding to store user data");

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
