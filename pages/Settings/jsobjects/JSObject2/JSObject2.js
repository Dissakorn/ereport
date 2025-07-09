export default {
  async createAccount() {
    // Get the username and password from the input widgets
    const username = Inp_User.text;
    const password = Inp_Pass.text;

    if (!username || !password) {
      showAlert("Username and Password are required!", "error");
      return;
    }

    // Convert the password into a SHA-256 hash
    function stringToBytes(str) {
      const bytes = [];
      for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
      }
      return new Uint8Array(bytes);
    }

    const data = stringToBytes(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

    // Insert the username and hashed password into the database
    try {
      await U_Prelim_Warn.run({
        username: username,
        hashpassword: hashHex,
      });
      showAlert("Account created successfully!", "success");
    } catch (error) {
      showAlert(`Error creating account: ${error.message}`, "error");
    }
  }
};
