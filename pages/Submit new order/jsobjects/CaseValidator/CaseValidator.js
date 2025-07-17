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
        console.log('Validating required fields...');
        
        // Check case number
        if (!this.safeString(Inp_Case_Num.text).trim()) {
            showAlert('กรุณากรอกหมายเลขคดี', 'error');
            return false;
        }
        
        // Check division selection
        if (!Sel_Division.selectedOptionValue) {
            showAlert('กรุณาเลือกเขตพื้นที่รับผิดชอบ', 'error');
            return false;
        }
        
        // Check case channel
        if (!Sel_Case_Channel.selectedOptionValue) {
            showAlert('กรุณาเลือกช่องทางคดี', 'error');
            return false;
        }
        
        // Check case origin
        if (!Sel_Case_Origin.selectedOptionValue) {
            showAlert('กรุณาเลือกแหล่งที่มาของคดี', 'error');
            return false;
        }
        
        // Check lead date
        if (!Inp_Lead_Date.selectedDate) {
            showAlert('กรุณาเลือกวันที่เกิดเหตุ', 'error');
            return false;
        }
        
        // Check number date
        if (!Inp_Receive_Date.selectedDate) {
            showAlert('กรุณาเลือกวันที่ ปปท.รับเรื่อง', 'error');
            return false;
        }
        
        // Check spinoff specific validation
        if (Boolean_Spinoff.isChecked && !Sel_Spinoff.selectedOptionValue) {
            showAlert('กรุณาเลือกคดีต้นฉบับ (สำหรับคดี Spinoff)', 'error');
            return false;
        }
        
        console.log('All required fields validated successfully');
        return true;
    },
    
    // Validate dates logic - CONSTRAINTS REMOVED
    validateDates() {
        console.log('Validating date logic...');
        
        const leadDate = Inp_Lead_Date.selectedDate;
        const receiveDate = Inp_Receive_Date.selectedDate;
        
        // Only validate that receive date is not before lead date
        if (receiveDate && leadDate) {
            if (moment(receiveDate).isBefore(moment(leadDate))) {
                showAlert('วันที่ ปปท.รับเรื่องไม่สามารถเป็นวันก่อนวันที่เกิดเหตุได้', 'error');
                return false;
            }
        }
        
        // Removed constraints for Inp_Case_Num_Date and Inp_Book_Date
        // These fields can now be any date without validation
        
        console.log('Date validation passed');
        return true;
    },
    
    // Validate damage value - REMOVED
    validateDamageValue() {
        console.log('Damage value validation skipped');
        return true;
    },
    
    // Validate spinoff specific fields
    validateSpinoffFields() {
        console.log('Validating spinoff fields...');
        
        if (Boolean_Spinoff.isChecked) {
            if (!Sel_Spinoff.selectedOptionValue) {
                showAlert('กรุณาเลือกคดีต้นฉบับสำหรับคดี Spinoff', 'error');
                return false;
            }
        }
        
        console.log('Spinoff validation passed');
        return true;
    },
    
    // Check for duplicate case number
    async checkDuplicateCase() {
        console.log('Checking for duplicate case number...');
        
        try {
            await CheckDuplicateCaseNumber.run();
            
            if (CheckDuplicateCaseNumber.data && CheckDuplicateCaseNumber.data.length > 0) {
                const existingCase = CheckDuplicateCaseNumber.data[0];
                const caseNumber = this.getFormattedCaseNumber();
                showAlert(`คดีหมายเลข ${caseNumber} มีอยู่แล้วในระบบ (ID: ${existingCase.case_id})`, 'error');
                return false;
            }
            
            console.log('No duplicate case found');
            return true;
        } catch (error) {
            console.error('Error checking duplicate case:', error);
            showAlert('เกิดข้อผิดพลาดในการตรวจสอบหมายเลขคดี', 'error');
            return false;
        }
    },
    
    // Complete validation before adding case
    async validateBeforeAdd() {
        console.log('=== Starting complete case validation ===');
        
        try {
            // 1. Validate case number format
            console.log('Step 1: Validating case number format...');
            if (!this.validateCaseNumber()) {
                console.log('❌ Case number validation failed');
                return false;
            }
            
            // 2. Validate required fields
            console.log('Step 2: Validating required fields...');
            if (!this.validateRequiredFields()) {
                console.log('❌ Required fields validation failed');
                return false;
            }
            
            // 3. Validate dates logic
            console.log('Step 3: Validating date logic...');
            if (!this.validateDates()) {
                console.log('❌ Date validation failed');
                return false;
            }
            
            // 4. Validate damage value
            console.log('Step 4: Validating damage value...');
            if (!this.validateDamageValue()) {
                console.log('❌ Damage value validation failed');
                return false;
            }
            
            // 5. Validate spinoff fields
            console.log('Step 5: Validating spinoff fields...');
            if (!this.validateSpinoffFields()) {
                console.log('❌ Spinoff validation failed');
                return false;
            }
            
            // 6. Check for duplicate case number
            console.log('Step 6: Checking for duplicates...');
            if (!(await this.checkDuplicateCase())) {
                console.log('❌ Duplicate check failed');
                return false;
            }
            
            console.log('✅ All validations passed successfully!');
            return true;
            
        } catch (error) {
            console.error('Validation error:', error);
            showAlert('เกิดข้อผิดพลาดในการตรวจสอบข้อมูล', 'error');
            return false;
        }
    },
    
    // Format case number for display
    getFormattedCaseNumber() {
        const caseNum = this.safeString(Inp_Case_Num.text);
        const caseYear = this.safeString(Inp_Case_Year.text) || (moment().year() + 543).toString();
        return `${caseNum}/${caseYear}`;
    },
    
    // Get next suggested case number
    async suggestNextCaseNumber() {
        try {
            const currentYear = this.safeString(Inp_Case_Year.text) || (moment().year() + 543).toString();
            const currentNum = parseInt(this.safeString(Inp_Case_Num.text)) || 0;
            
            // Simple increment suggestion
            const nextNum = (currentNum + 1).toString();
            return `${nextNum}/${currentYear}`;
        } catch (error) {
            console.error('Error suggesting next case number:', error);
            return null;
        }
    },
    
    // Reset form after successful submission
    resetForm() {
        console.log('Resetting form after successful submission...');
        
        try {
            resetWidget('Inp_Case_Num');
            resetWidget('Inp_Case_Year');
            resetWidget('Sel_Division');
            resetWidget('Sel_Case_Channel');
            resetWidget('Sel_Case_Origin');
            resetWidget('Inp_Lead_Date');
            resetWidget('Inp_Case_Num_Date');
            resetWidget('Inp_Book_Num');
            resetWidget('Inp_Book_Date');
            resetWidget('Inp_Receive_Num');
            resetWidget('Inp_Receive_Date');
            resetWidget('Inp_Nacc_Num');
            resetWidget('Inp_Damage_Value');
            resetWidget('Boolean_Spinoff');
            resetWidget('Sel_Spinoff');
            
            console.log('Form reset completed');
        } catch (error) {
            console.error('Error resetting form:', error);
        }
    },
    
    // Main function to handle case addition
    async addCase() {
        console.log('🚀 Starting case addition process...');
        storeValue('isSubmitting', true);
        
        try {
            // Run complete validation
            const isValid = await this.validateBeforeAdd();
            
            if (!isValid) {
                console.log('❌ Validation failed - keeping form data');
                storeValue('isSubmitting', false);
                return false; // VALIDATION FAILED - NO RESET
            }
            
            console.log('✅ Validation passed - proceeding with case creation');
            
            // Validation passed, now add the case
            try {
                await I_Cases.run();
                
                const caseNumber = this.getFormattedCaseNumber();
                console.log('✅ Case added successfully:', caseNumber);
                showAlert(`เพิ่มคดี ${caseNumber} สำเร็จ`, 'success');
                
                // SUCCESS - Reset form only on success
                this.resetForm();
                
                storeValue('isSubmitting', false);
                return true;
                
            } catch (dbError) {
                console.error('❌ Database insertion failed:', dbError);
                showAlert('เกิดข้อผิดพลาดในการเพิ่มคดี: ' + dbError.message, 'error');
                storeValue('isSubmitting', false);
                return false; // DATABASE ERROR - NO RESET
            }
            
        } catch (error) {
            console.error('❌ Case addition process failed:', error);
            showAlert('เกิดข้อผิดพลาดในการประมวลผล', 'error');
            storeValue('isSubmitting', false);
            return false; // PROCESS ERROR - NO RESET
        }
    },
    
    // Utility function to get validation summary
    getValidationSummary() {
        const summary = [];
        
        // Case number
        const caseNum = this.safeString(Inp_Case_Num.text);
        if (!caseNum.trim()) {
            summary.push('❌ หมายเลขคดี');
        } else if (!/^\d+$/.test(caseNum)) {
            summary.push('⚠️ รูปแบบหมายเลขคดี');
        } else {
            summary.push('✅ หมายเลขคดี');
        }
        
        // Division
        if (!Sel_Division.selectedOptionValue) {
            summary.push('❌ เขตพื้นที่');
        } else {
            summary.push('✅ เขตพื้นที่');
        }
        
        // Case channel
        if (!Sel_Case_Channel.selectedOptionValue) {
            summary.push('❌ ช่องทางคดี');
        } else {
            summary.push('✅ ช่องทางคดี');
        }
        
        // Case origin
        if (!Sel_Case_Origin.selectedOptionValue) {
            summary.push('❌ แหล่งที่มา');
        } else {
            summary.push('✅ แหล่งที่มา');
        }
        
        // Lead date
        if (!Inp_Lead_Date.selectedDate) {
            summary.push('❌ วันที่ได้รับเรื่อง');
        } else {
            summary.push('✅ วันที่ได้รับเรื่อง');
        }
        
        // Number date
        if (!Inp_Receive_Date.selectedDate) {
            summary.push('❌ วันที่ ปปท. รับเรื่อง');
        } else {
            summary.push('✅ วันที่ ปปท. รับเรื่อง');
        }
        
        return summary.join(' | ');
    }
};