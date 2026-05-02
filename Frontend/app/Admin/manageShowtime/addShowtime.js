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
    // ค้นหาส่วนของ saveBtn.addEventListener('click', ... )
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => {
        const movieName = document.getElementById('movieInput').value;
        const time = document.getElementById('timeInput').value;
        const branch = document.getElementById('branchInput').value; // ดึงจาก Select
        const theater = document.getElementById('theaterInput').value;
        const format = document.getElementById('formatInput').value; // ดึงประเภทการฉาย
        const price = document.getElementById('priceInput').value;
        const date = document.getElementById('showtimeDate').value;

        if (!movieName || !time) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        const newShowtime = {
            id: Date.now(),
            movieName,
            time,
            branch,
            theater,
            format, // เก็บค่าประเภทการฉายลงใน Object
            price,
            date
        };

        const existingData = JSON.parse(localStorage.getItem('emerald_showtimes')) || [];
        existingData.push(newShowtime);
        localStorage.setItem('emerald_showtimes', JSON.stringify(existingData));

        alert('บันทึกรอบฉายสำเร็จ!');
        window.location.href = 'manageShowtime.html';
    });
});