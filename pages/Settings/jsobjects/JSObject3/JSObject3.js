export default {
  // Function to run U_Prelim_Warn and store the result with a success alert
  async updatePrelimDeadline() {
    try {
      // Run the U_Prelim_Warn SQL query
      await U_Prelim_Warn.run();

      // Store the result in appsmith.store
      const prelimDeadline = U_Prelim_Warn.data[0]?.prelim_deadline; // Assuming the query returns an object with 'prelim_deadline'
      storeValue('prelim_deadline', prelimDeadline);

      // Show success alert
      showAlert("Preliminary deadline updated successfully!", "success");

      return appsmith.store.prelim_deadline;
    } catch (error) {
      console.error("Error updating prelim deadline:", error);
      showAlert("Error updating preliminary deadline.", "error");
      return null;
    }
  },

  // Function to run U_Invest_Warn and store the result with a success alert
  async updateInvestDeadline() {
    try {
      // Run the U_Invest_Warn SQL query
      await U_Invest_Warn.run();

      // Store the result in appsmith.store
      const investDeadline = U_Invest_Warn.data[0]?.invest_deadline; // Assuming the query returns an object with 'invest_deadline'
      storeValue('invest_deadline', investDeadline);

      // Show success alert
      showAlert("Investigation deadline updated successfully!", "success");

      return appsmith.store.invest_deadline;
    } catch (error) {
      console.error("Error updating invest deadline:", error);
      showAlert("Error updating investigation deadline.", "error");
      return null;
    }
  },

  // Combined function to run both queries and update the store with a success alert
  async updateDeadlines() {
    try {
      await this.updatePrelimDeadline();
      await this.updateInvestDeadline();

      // Show success alert after both updates are done
      showAlert("All deadlines updated successfully!", "success");

      return {
        prelim_deadline: appsmith.store.prelim_deadline,
        invest_deadline: appsmith.store.invest_deadline,
      };
    } catch (error) {
      console.error("Error updating deadlines:", error);
      showAlert("Error updating deadlines.", "error");
      return null;
    }
  },
};
