export default {
  async Btn_Add_InvestigatoronClick () {
    if (appsmith.store.isSubmitting) return;

    storeValue("isSubmitting", true); // Lock button

    try {
      await Insert_public_investigator1.run(); // Insert
      await Select_public_investigator2.run(); // Refresh

      Inp_Inv_Name.setValue('');
    } catch (e) {
      showAlert("Something went wrong", "error");
    }

    // Wait 3 seconds before unlocking the button
    setTimeout(() => {
      storeValue("isSubmitting", false); // Unlock after 3 sec
    }, 3000);
  }
}
