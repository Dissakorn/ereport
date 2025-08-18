export default {
	myVar1: [],
	myVar2: {},
	
	async runDivisionThenCases() {
		try {
			await R_DIVISION.run();
			await R_CASES.run();
			showAlert("ยินดีต้อนรับ", "success");
		} catch (error) {
			showAlert("Error running queries: " + error.message, "การโหลดข้อมูลล้มเหลว");
		}
	}
}