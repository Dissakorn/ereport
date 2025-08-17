export default {
	myVar1: [],
	myVar2: {},
	
	getTextColor: (bgColor) => {
		const r = parseInt(bgColor.substring(1, 3), 16);
		const g = parseInt(bgColor.substring(3, 5), 16);
		const b = parseInt(bgColor.substring(5, 7), 16);
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance > 0.5 ? '#000000' : '#ffffff';
	},

	getBackgroundColor: (row) => {
		const currentTime = new Date();
		const settings = getSettings.data[0];
		
		// Special Case: Case type is 2
		if (row.case_type == 2) {
			return '#eeefef';
		}
		
		// Preliminary State: If prelim_result is not 2 (not proceeding to investigation)
		if (row.prelim_result !== 2) {
			const prelimDeadline = new Date(row.prelim_deadline);
			const daysUntilPrelimDeadline = Math.ceil((prelimDeadline - currentTime) / (1000 * 60 * 60 * 24));
			
			// Prelim complete or decided (not proceeding or other result)
			if (row.prelim_status == 8 || (row.prelim_result !== 0 && row.prelim_result !== 1)) {
				return '#27ae60'; // Green
			}
			
			// Prelim warning period
			if (daysUntilPrelimDeadline <= settings.prelim_warning && daysUntilPrelimDeadline >= 0) {
				return '#fff3cd'; // Yellow/Warning
			}
			
			// Prelim late
			if (daysUntilPrelimDeadline < 0) {
				return '#d9534f'; // Red
			}
			
			// Prelim ongoing
			return '#ffffff'; // White
		}
		
		// Investigation State: If prelim_result is 2 (proceeding to investigation)
		const invesDeadline = new Date(row.inves_deadline);
		const daysUntilInvesDeadline = Math.ceil((invesDeadline - currentTime) / (1000 * 60 * 60 * 24));
		
		// Investigation complete
		if (row.inves_status == 7) {
			return '#27ae60'; // Green
		}
		
		// Investigation warning period
		if (daysUntilInvesDeadline <= settings.inves_warning && daysUntilInvesDeadline >= 0) {
			return '#fff3cd'; // Yellow/Warning
		}
		
		// Investigation late
		if (daysUntilInvesDeadline < 0) {
			return '#d9534f'; // Red
		}
		
		// Investigation ongoing
		return '#ffffff'; // White
	},

	getRowColors: (row) => {
		const bgColor = this.getBackgroundColor(row);
		const textColor = this.getTextColor(bgColor);
		return {
			backgroundColor: bgColor,
			color: textColor
		};
	},

	myFun1() {
		// write code here
		// this.myVar1 = [1,2,3]
	},
	
	async myFun2() {
		// use async-await or promises
		// await storeValue('varName', 'hello world')
	}
}