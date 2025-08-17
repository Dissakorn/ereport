export default {
  myVar1: [],
  myVar2: {},

	exten_prelim: async () => {
		const thaiMonths = {
			Jan: 'ม.ค.', Feb: 'ก.พ.', Mar: 'มี.ค.', Apr: 'เม.ย.',
			May: 'พ.ค.', Jun: 'มิ.ย.', Jul: 'ก.ค.', Aug: 'ส.ค.',
			Sep: 'ก.ย.', Oct: 'ต.ค.', Nov: 'พ.ย.', Dec: 'ธ.ค.'
		};

		try {
			const extensionCount = data_table.selectedRow.prelim_extension_count || 0;

			if (extensionCount >= 2) {
				showAlert("ไม่สามารถขยายเวลาได้เกิน 2 ครั้ง", "warning");
				return;
			}

			const currentDeadline = new Date(data_table.selectedRow.prelim_deadline || new Date());
			const newDeadline = new Date(currentDeadline.getTime() + 60 * 24 * 60 * 60 * 1000); // +60 days

			const options = { day: '2-digit', month: 'short', year: '2-digit' };
			const formatted = newDeadline.toLocaleDateString('en-UK', options);
			const thaiDate = formatted.replace(/[a-zA-Z]+/, (m) => thaiMonths[m] || m);

			storeValue('Num_Prelim_Deadline', thaiDate);
			if (Num_Prelim_Deadline?.setText) {
				Num_Prelim_Deadline.setText(thaiDate);
			}

			await U_DEADLINE_PRELIM.run();
			showAlert("ขยายเวลาสำเร็จ", "success");
		} catch (err) {
			showAlert("เกิดข้อผิดพลาด: " + err.message, "error");
		}
	},

  exten_inves: async () => {
    const thaiMonths = {
      Jan: 'ม.ค.', Feb: 'ก.พ.', Mar: 'มี.ค.', Apr: 'เม.ย.',
      May: 'พ.ค.', Jun: 'มิ.ย.', Jul: 'ก.ค.', Aug: 'ส.ค.',
      Sep: 'ก.ย.', Oct: 'ต.ค.', Nov: 'พ.ย.', Dec: 'ธ.ค.'
    };

    try {
      // Step 1: Calculate new deadline (+365 days)
      const currentDeadline = new Date(data_table.selectedRow.inves_deadline || new Date());
      const newDeadline = new Date(currentDeadline.getTime() + 365 * 24 * 60 * 60 * 1000); // 365 days

      // Step 2: Format to Thai date
      const options = { day: '2-digit', month: 'short', year: '2-digit' };
      const formatted = newDeadline.toLocaleDateString('en-UK', options);
      const thaiDate = formatted.replace(/[a-zA-Z]+/, (m) => thaiMonths[m] || m);

      // Step 3: Update Appsmith state and UI
      storeValue('Num_Inves_Deadline', thaiDate);
      if (Num_Inves_Deadline?.setText) {
        Num_Inves_Deadline.setText(thaiDate);
      }

      // Step 4: Run SQL update
      await U_DEADLINE_INVES.run();
      showAlert("ขยายเวลาสำเร็จ", "success");
    } catch (err) {
      showAlert("เกิดข้อผิดพลาด: " + err.message, "error");
    }
  }
};
