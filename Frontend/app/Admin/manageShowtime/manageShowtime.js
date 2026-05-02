document.addEventListener('DOMContentLoaded', () => {
// ฟังก์ชันสำหรับส่งค่าวันที่ไปหน้า addShowtime
    const goToWithDate = () => {
        // ดึงข้อความ "10 กุมภาพันธ์ 2569" จาก <h2>
        const dateText = document.querySelector('.date-display h2').innerText;
        // ส่งไปหน้า addShowtime.html?date=...
        window.location.href = `addShowtime.html?date=${encodeURIComponent(dateText)}`;
    };

    const createBtn = document.querySelector('.create-btn');
    if (createBtn) {
        createBtn.onclick = goToWithDate;
    }

    const fabBtn = document.querySelector('.fab-calendar-btn');
    if (fabBtn) {
        fabBtn.onclick = goToWithDate;
    }
    // ระบบ Log Out (เหมือนหน้า editMovie)
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
                // ย้อนกลับไปหน้า login
                window.location.href = '../login/login.html';
            }
        };
    }

    // ฟังก์ชันเบื้องต้นสำหรับปุ่ม Delete (ถ้าต้องการ)
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.onclick = () => {
            if(confirm('ต้องการลบรอบฉายนี้ใช่หรือไม่?')) {
                btn.closest('.showtime-item').remove();
            }
        };
    });
});