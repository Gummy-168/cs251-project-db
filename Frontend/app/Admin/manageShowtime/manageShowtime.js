document.addEventListener('DOMContentLoaded', () => {
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