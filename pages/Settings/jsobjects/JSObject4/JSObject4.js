export default {
	Btn_Add_InvestigatoronClick () {
		Select_public_investigator1.run(() => {
			setTimeout(() => {
				Inp_Inv_Name.setValue('');
			}, 3000);
		});
	}
}
