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
    saveBtn.addEventListener('click', () => {
        const movieName = document.getElementById('movieInput').value;
        const time = document.getElementById('timeInput').value;
        const branch = document.getElementById('branchInput').value;
        const theater = document.getElementById('theaterInput').value;
        const price = document.getElementById('priceInput').value;

        if (!movieName || !time) {
            alert('กรุณากรอกชื่อหนังและเวลา');
            return;
        }

        const newShowtime = {
            id: Date.now(), // ใช้ตัวเลข Unique สำหรับลบ
            movieName,
            time,
            branch,
            theater,
            price,
            format: document.getElementById('formatInput').value
        };

        const existingData = JSON.parse(localStorage.getItem('emerald_showtimes')) || [];
        existingData.push(newShowtime);
        localStorage.setItem('emerald_showtimes', JSON.stringify(existingData));

        alert('บันทึกสำเร็จ!');
        window.location.href = 'manageShowtime.html';
    });
});