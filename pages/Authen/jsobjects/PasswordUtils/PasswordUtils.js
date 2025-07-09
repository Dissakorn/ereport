export default {
    // Generate random salt
    generateSalt: () => {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    // Hash password with PBKDF2
    async hashPassword(password, salt) {
        try {
            const encoder = new TextEncoder();
            const key = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                'PBKDF2',
                false,
                ['deriveBits']
            );
            
            const hashBuffer = await crypto.subtle.deriveBits({
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations: 100000,
                hash: 'SHA-256'
            }, key, 256);
            
            const hashArray = new Uint8Array(hashBuffer);
            return Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            throw new Error('Password hashing failed');
        }
    },

    // Verify password
    async verifyPassword(password, storedHash, salt) {
        try {
            const newHash = await this.hashPassword(password, salt);
            return newHash === storedHash;
        } catch (error) {
            return false;
        }
    },

    // Validate new password (Thai requirements)
    validateNewPassword: (password) => {
        // 8-15 characters
        if (password.length < 8 || password.length > 15) {
            return { valid: false, message: "รหัสผ่านต้องมี 8-15 ตัวอักษร" };
        }
        
        // Must have lowercase
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: "ต้องมีตัวอักษรเล็กภาษาอังกฤษ" };
        }
        
        // Must have uppercase  
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: "ต้องมีตัวอักษรใหญ่ภาษาอังกฤษ" };
        }
        
        // Must have numbers
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: "ต้องมีตัวเลข" };
        }
        
        // Must have special characters (!@#$*)
        if (!/[!@#$*]/.test(password)) {
            return { valid: false, message: "ต้องมีอักขระพิเศษ (!@#$*)" };
        }
        
        return { valid: true, message: "รหัสผ่านถูกต้อง" };
    },

    // Simple hash for initial passwords (less secure, temporary)
    simpleHash: (password) => {
        // This creates: btoa(password + "temp_salt")
        const combined = password + "temp_salt";
        return btoa(combined);
    },

    // Test hash generation (for debugging)
    testHashGeneration: (password) => {
        const hash = btoa(password + "temp_salt");
        console.log(`Password: ${password}`);
        console.log(`Hash: ${hash}`);
        console.log(`SQL to update: UPDATE "user" SET password_hash = '${hash}', salt = 'temp_salt', password = '${password}', is_temp_password = TRUE WHERE username = 'your_username';`);
        return hash;
    }
};
