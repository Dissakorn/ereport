export default {
	myVar1: [],
	myVar2: {},
	myFun1 () {
		// Setting all input fields to empty string
		Inp_Case_Num.setValue('');
		Inp_Num_Date.setValue(''); // If formatted date is handled automatically, otherwise, use formattedDate = ''
		Inp_Nacc_Num.setValue('');
		Inp_Book_Num.setValue('');
		Inp_Book_Date.setValue(''); // If formatted date is handled automatically, otherwise, use formattedDate = ''
		Inp_Receive_Num.setValue('');
		Inp_Lead_Date.setValue(''); // If formatted date is handled automatically, otherwise, use formattedDate = ''
	Sel_Case_Origin.setSelectedOption('');
		Sel_Division.setSelectedOption(''); // Reset the dropdown to default or empty value
	},
	async myFun2 () {
		// use async-await or promises if needed
		// await storeValue('varName', 'hello world')
	}
}
