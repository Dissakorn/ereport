export default {
    // Create new user with temporary password
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
