export default {
  myVar1: [],
  myVar2: {},

  myFun1() {
    // Reset the dropdowns to default or empty value
    Sel_Main_Case.setSelectedOption('');
    Sel_Sub_Case.setSelectedOption('');
  },

  async myFun2() {
    try {
      // Run the consolidation query
      await U_Consolidation.run();

      // Show success message
      showAlert(
        `สำนวนที่ ${Sel_Sub_Case.selectedOptionValue} ถูกรวมกับ ${Sel_Main_Case.selectedOptionValue} แล้ว`,
        "success"
      );

      // Reset both dropdowns
      this.myFun1();
    } catch (error) {
      // Show error alert if the query fails
      showAlert("การดำเนินการล้มเหลว", "error");
    }
  }
};
