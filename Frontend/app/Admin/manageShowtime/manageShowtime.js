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
    const showtimeContainer = document.querySelector('.content');

    const loadStoredShowtimes = () => {
    const storedData = JSON.parse(localStorage.getItem('emerald_showtimes')) || [];
    const showtimeContainer = document.querySelector('.content');

    storedData.forEach(item => {
        // 1. ค้นหาว่าในหน้าเว็บมีหัวข้อสาขานี้ (เช่น RANGSIT) อยู่หรือยัง
        let existingBranch = Array.from(document.querySelectorAll('.location-title'))
                                  .find(el => el.innerText.trim().toUpperCase() === item.branch.toUpperCase());

        if (existingBranch) {
            const branchGroup = existingBranch.parentElement;
            
            // 2. ค้นหาว่าในสาขานี้ มีเลขโรงนี้ (เช่น Theater 1) อยู่แล้วหรือยัง
            let existingTheater = Array.from(branchGroup.querySelectorAll('.theater-header span:first-child'))
                                       .find(el => el.innerText.trim() === `Theater ${item.theater}`);

            if (existingTheater) {
                // 3. ถ้าเจอโรงเดิม ให้เพิ่มแค่ "รอบฉาย" เข้าไปใน showtime-list ของโรงนั้น
                const showtimeList = existingTheater.closest('.theater-card').querySelector('.showtime-list');
                const newShowtimeItem = `
                    <div class="showtime-item">
                        <div class="time-box highlight">${item.time}</div>
                        <div class="price-info">
                            <span class="price-label">PRICE</span>
                            <span class="price-value">${item.price} บาท</span>
                        </div>
                        <button class="delete-btn" onclick="confirmDelete(${item.id})">🗑️</button>
                    </div>`;
                showtimeList.insertAdjacentHTML('beforeend', newShowtimeItem);
            } else {
                // 4. ถ้ามีสาขาแต่ยังไม่มีโรงนี้ ให้สร้าง Theater Card ใหม่ในสาขาเดิม
                const theaterHtml = `
                    <div class="theater-card" style="margin-top: 15px;">
                        <div class="theater-header">
                            <span>Theater ${item.theater}</span>
                            <span class="format">${item.format || 'DIGITAL 2D'}</span>
                        </div>
                        <div class="showtime-list">
                            <div class="showtime-item">
                                <div class="time-box highlight">${item.time}</div>
                                <div class="price-info">
                                    <span class="price-label">PRICE</span>
                                    <span class="price-value">${item.price} บาท</span>
                                </div>
                                <button class="delete-btn" onclick="confirmDelete(${item.id})">🗑️</button>
                            </div>
                        </div>
                    </div>`;
                branchGroup.insertAdjacentHTML('beforeend', theaterHtml);
            }
        } else {
            // 5. ถ้ายังไม่มีสาขานี้เลย ให้สร้างกล่อง Group ใหม่ทั้งหมด (สาขา + โรง + รอบฉาย)
            const newBranchHtml = `
                <div class="location-group">
                    <h2 class="location-title">${item.branch}</h2>
                    <div class="theater-card">
                        <div class="theater-header">
                            <span>Theater ${item.theater}</span>
                            <span class="format">${item.format || 'DIGITAL 2D'}</span>
                        </div>
                        <div class="showtime-list">
                            <div class="showtime-item">
                                <div class="time-box highlight">${item.time}</div>
                                <div class="price-info">
                                    <span class="price-label">PRICE</span>
                                    <span class="price-value">${item.price} บาท</span>
                                </div>
                                <button class="delete-btn" onclick="confirmDelete(${item.id})">🗑️</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            showtimeContainer.insertAdjacentHTML('beforeend', newBranchHtml);
            }
        });
    };
        // สำคัญมาก: ต้องเรียกใช้ฟังก์ชันนี้ด้วย!
        loadStoredShowtimes();
});
// ฟังก์ชันลบสำหรับรายการที่เขียนไว้ใน HTML (Static)
window.confirmDeleteLocal = function(button) {
    if (confirm('คุณต้องการลบรอบฉายนี้ใช่หรือไม่?')) {
        alert('ระบบกำลังดำเนินการลบ showtime นี้...');
        
        // หา Element ที่เล็กที่สุดที่ครอบคลุมแค่รอบฉายเดียว
        const item = button.closest('.showtime-item');
        if (item) {
            item.style.opacity = '0';
            setTimeout(() => {
                item.remove();
                // เสริม: ถ้าในโรงนั้นไม่มีรอบฉายเหลือแล้ว อาจจะพิจารณาลบ Card ทิ้งได้ในภายหลัง
            }, 300);
        }
    }
};