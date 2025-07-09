export default {
	default_next_Prelim_Status_onClick() {
		storeValue("isNextPressed",false);
	},
  next_Prelim_Status_onClick() {
    // Toggle the value of 'isNextPressed'
    storeValue("isNextPressed", !appsmith.store.isNextPressed);
  }
}