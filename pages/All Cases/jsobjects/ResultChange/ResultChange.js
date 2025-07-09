export default {
  handlePrelimResultChange: () => {
    const prelimResult = Sel_Prelim_Result.selectedOptionValue;
    const invesStatus = Sel_Inves_Status.selectedOptionValue;

    // ✅ If Prelim Result = 2 and Inves Status is still 0 → set to 1
    if (prelimResult == 2 && invesStatus == 0) {
      Sel_Inves_Status.setSelectedOption(1);
    }
  }
}
