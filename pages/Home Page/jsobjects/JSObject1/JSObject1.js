export default {
  myVar1: [],
  myVar2: {},

  // Get the selected or current year of interest
  getYearOfInterest() {
    // Get the current year in AD
    const currentYearAD = new Date().getFullYear();
    const currentYearBE = currentYearAD + 543; // Convert to BE

    // Check if the year has been set via the store or use the current year
    const selectedYear = appsmith.store.yearOfInterest || currentYearBE;

    return selectedYear; // Return the selected year or default to current year
  },

  // Set the year of interest into the Appsmith store
  setYearOfInterest() {
    // Get the selected year from the dropdown widget
    const selectedYear = Sel_Year_Of_Int.selectedOptionValue;

    // Store the selected year in Appsmith's local storage
    storeValue('yearOfInterest', selectedYear);
    return appsmith.store.yearOfInterest; // Return the stored year
  },

  // Fetch settings and store them in Appsmith's local storage
  async getSetting() {
    try {
      // Execute the R_Settings query
      const response = await R_Settings.run();

      // Store specific settings into Appsmith's local storage
      if (response && response.length > 0) {
        const prelimDeadline = response[0].prelim_deadline;
        const investDeadline = response[0].invest_deadline;

        await storeValue('prelim_deadline', prelimDeadline);
        await storeValue('invest_deadline', investDeadline);

        return {
          prelim_deadline: prelimDeadline,
          invest_deadline: investDeadline,
        };
      } else {
        throw new Error("No data returned from R_Settings query");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      return null;
    }
  },
};
