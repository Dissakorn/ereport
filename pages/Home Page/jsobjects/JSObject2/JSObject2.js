export default {
  myVar1: [],
  myVar2: {},

  // Get the current year in BE
  getYear() {
    const currentYearAD = new Date().getFullYear(); // Current year in AD
    const currentYearBE = currentYearAD + 543; // Convert to BE
    return currentYearBE;
  },

  // Get the current month (1-based index)
  getMonth() {
    const currentMonthIndex = new Date().getMonth(); // Month index (0-11)
    const currentMonth = currentMonthIndex + 1; // Convert to 1-based month
    return currentMonth;
  },

  // Get the previous month and its year in BE
  getPreviousMonthAndYear() {
    const currentMonth = this.getMonth();
    const currentYearBE = this.getYear();
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYearBE = currentMonth === 1 ? currentYearBE - 1 : currentYearBE;
    return { previousMonth, previousYearBE };
  },

  // Get the next month and its year in BE
  getNextMonthAndYear() {
    const currentMonth = this.getMonth();
    const currentYearBE = this.getYear();
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYearBE = currentMonth === 12 ? currentYearBE + 1 : currentYearBE;
    return { nextMonth, nextYearBE };
  },

  // Store the current year and month in Appsmith's store
  async storeYearAndMonth() {
    try {
      const yearBE = this.getYear();
      const month = this.getMonth();
      await storeValue('currentYearBE', yearBE); // Store year in BE
      await storeValue('currentMonth', month);   // Store month
      return { yearBE, month };
    } catch (error) {
      showAlert('Failed to store year and month.', 'error');
      console.error(error);
    }
  },

  // Store the previous month and year in Appsmith's store
  async storePreviousMonthAndYear() {
    try {
      const { previousMonth, previousYearBE } = this.getPreviousMonthAndYear();
      await storeValue('previousMonth', previousMonth);
      await storeValue('previousYearBE', previousYearBE);
      return { previousMonth, previousYearBE };
    } catch (error) {
      showAlert('Failed to store previous month and year.', 'error');
      console.error(error);
    }
  },

  // Store the next month and year in Appsmith's store
  async storeNextMonthAndYear() {
    try {
      const { nextMonth, nextYearBE } = this.getNextMonthAndYear();
      await storeValue('nextMonth', nextMonth);
      await storeValue('nextYearBE', nextYearBE);
      return { nextMonth, nextYearBE };
    } catch (error) {
      showAlert('Failed to store next month and year.', 'error');
      console.error(error);
    }
  }
};
