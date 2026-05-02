document.addEventListener('DOMContentLoaded', () => {
    // 1. ดึงวันที่จาก URL มากรอกให้อัตโนมัติ
    const urlParams = new URLSearchParams(window.location.search);
    const dateFromUrl = urlParams.get('date');

    if (dateFromUrl) {
        const dateInput = document.getElementById('showtimeDate');
        if (dateInput) {
            dateInput.value = dateFromUrl;
        }
    }

    // 2. จัดการการบันทึก
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const movieInfo = document.getElementById('movieInput').value;
            const time = document.getElementById('timeInput').value;

            if (!movieInfo) {
                alert('กรุณากรอกข้อมูลภาพยนตร์');
                return;
            }

            alert(`บันทึกรอบฉายหนัง: ${movieInfo} เวลา: ${time} เรียบร้อย!`);
            window.location.href = 'manageShowtime.html';
        });
    }
});