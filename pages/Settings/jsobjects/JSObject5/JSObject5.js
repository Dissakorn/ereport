export default {
  async runAndStoreWarnings() {
    const settings = getWarnings.data[0];

    if (!settings) {
      console.warn("No settings returned from getWarnings");
      return;
    }

    const {
      invest_deadline,
      prelim_deadline,
      invest_warning,
      prelim_warning
    } = settings;

    await storeValue("invest_deadline", invest_deadline);
    await storeValue("prelim_deadline", prelim_deadline);
    await storeValue("invest_warning", invest_warning);
    await storeValue("prelim_warning", prelim_warning);

    return {
      invest_deadline,
      prelim_deadline,
      invest_warning,
      prelim_warning
    };
  }
}
