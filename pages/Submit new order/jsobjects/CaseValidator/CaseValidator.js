export default {
    // Safe function to convert any value to string
    safeString(value) {
        if (value === null || value === undefined) {
            return '';
        }
        return String(value);
    },
    
    // Validate case number format
    validateCaseNumber() {
        const caseNum = this.safeString(Inp_Case_Num.text);
        const caseYear = this.safeString(Inp_Case_Year.text);
        
        // Check if case number is provided
        if (!caseNum || caseNum.trim() === '') {
            showAlert('กรุณากรอกหมายเลขคดี', 'error');
            return false;
        }
        
        // Validate case number format (must be numeric, any length)
        if (!/^\d+$/.test(caseNum)) {
            showAlert('หมายเลขคดีต้องเป็นตัวเลขเท่านั้น', 'error');
            return false;
        }
        
        // If year is provided, validate it
        if (caseYear && caseYear.trim() !== '') {
            if (!/^\d{4}$/.test(caseYear)) {
                showAlert('ปีคดีต้องเป็นตัวเลข 4 หลัก (เช่น 2568)', 'error');
                return false;
            }
            
            const year = parseInt(caseYear);
            if (year < 2500 || year > 2600) {
                showAlert('ปีคดีไม่ถูกต้อง กรุณากรอกปี พ.ศ. ที่ถูกต้อง', 'error');
                return false;
            }
        }
        
        return true;
    },
    
    // Validate required fields
    validateRequiredFields() {
        // Check case number
        if (!this.safeString(Inp_Case_Num.text).trim()) {
            showAlert('กรุณากรอกหมายเลขคดี', 'error');
            return false;
        }
        
        // Check division selection - NEW!
        if (!Sel_Division.selectedOptionValue) {
            showAlert('กรุณาเลือกเขตพื้นที่รับผิดชอบ', 'error');
            return false;
        }
        
        // Check corruption category
        if (!Sel_Corr_Category.selectedOptionValue) {
            showAlert('กรุณาเลือกประเภทการทุจริต', 'error');
            return false;
        }
        
        // Check case origin
        if (!Sel_Case_Origin.selectedOptionValue) {
            showAlert('กรุณาเลือกแหล่งที่มาของคดี', 'error');
            return false;
        }
        
        // Check lead date
        if (!Inp_Lead_Date.selectedDate) {
            showAlert('กรุณาเลือกวันที่ได้รับเรื่อง', 'error');
            return false;
        }
        
        // Check number date
        if (!Inp_Num_Date.selectedDate) {
            showAlert('กรุณาเลือกวันที่ออกหมายเลขคดี', 'error');
            return false;
        }
        
        // Check spinoff specific validation
        if (Boolean_Spinoff.isChecked && !Sel_Spinoff.selectedOptionValue) {
            showAlert('กรุณาเลือกคดีต้นฉบับ (สำหรับคดี Spinoff)', 'error');
            return false;
        }
        
        return true;
    },
    
    // Check for duplicate case number
    async checkDuplicateCase() {
        try {
            await CheckDuplicateCaseNumber.run();
            
            if (CheckDuplicateCaseNumber.data && CheckDuplicateCaseNumber.data.length > 0) {
                const existingCase = CheckDuplicateCaseNumber.data[0];
                const caseNumber = this.getFormattedCaseNumber();
                showAlert(`คดีหมายเลข ${caseNumber} มีอยู่แล้วในระบบ (ID: ${existingCase.case_id})`, 'error');
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error checking duplicate case:', error);
            showAlert('เกิดข้อผิดพลาดในการตรวจสอบหมายเลขคดี', 'error');
            return false;
        }
    },
    
    // Complete validation
    async validateBeforeAdd() {
        console.log('Starting validation...');
        
        try {
            // 1. Validate case number format
            if (!this.validateCaseNumber()) {
                return false;
            }
            
            // 2. Validate required fields (including Sel_Division)
            if (!this.validateRequiredFields()) {
                return false;
            }
            
            // 3. Check for duplicate case number
            if (!(await this.checkDuplicateCase())) {
                return false;
            }
            
            console.log('All validations passed!');
            return true;
            
        } catch (error) {
            console.error('Validation error:', error);
            showAlert('เกิดข้อผิดพลาดในการตรวจสอบ', 'error');
            return false;
        }
    },
    
    // Format case number for display
    getFormattedCaseNumber() {
        const caseNum = this.safeString(Inp_Case_Num.text);
        const caseYear = this.safeString(Inp_Case_Year.text) || (moment().year() + 543).toString();
        return `${caseNum}/${caseYear}`;
    }
};