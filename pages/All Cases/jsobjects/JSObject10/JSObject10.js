export default {
	myVar1: [],
	myVar2: {},
	
	async viewFileInNewPage() {
		if (R_FILE_1.data.length > 0 && R_FILE_1.data[0]?.file_1) {
			try {
				// Store file data in Appsmith store
				await storeValue('currentFile', {
					fileData: R_FILE_1.data[0].file_1,
					fileName: R_FILE_1.data[0].file_1_name,
					fileType: R_FILE_1.data[0].file_1_type,
					fileSize: R_FILE_1.data[0].file_1_size,
					caseId: R_FILE_1.data[0].case_id
				});

			} catch (error) {
				showAlert("Error loading file", "error");
				console.error("Navigation error:", error);
			}
		} else {
			showAlert("No file to view", "warning");
		}
	}
}