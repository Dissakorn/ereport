export default {
  async getSHA256Hash(password) {
    // Convert the password string to a UTF-8 byte array
    function stringToBytes(str) {
      const bytes = [];
      for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
      }
      return new Uint8Array(bytes);
    }

    // Compute the hash using the Web Crypto API
    const data = stringToBytes(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }
};
