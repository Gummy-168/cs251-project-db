document.addEventListener('DOMContentLoaded', () => {
    // 1. จัดการข้อมูลวันที่
    let dateList = JSON.parse(localStorage.getItem('emerald_dates')) || [
        { id: '2026-02-10', text: '10 กุมภาพันธ์ 2569' }
    ];
    
    // เรียง Ascending (น้อยไปมาก)
    dateList.sort((a, b) => new Date(a.id) - new Date(b.id));
    let currentSelectedDateId = dateList[0].id;

    const renderDateCards = () => {
        const container = document.getElementById('dateScrollContainer');
        if (!container) return;
        container.innerHTML = '';
        
        dateList.sort((a, b) => new Date(a.id) - new Date(b.id));

        dateList.forEach(date => {
            const isActive = date.id === currentSelectedDateId ? 'active' : '';
            const card = document.createElement('div');
            card.className = `date-card ${isActive}`;
            card.onclick = () => {
                currentSelectedDateId = date.id;
                renderDateCards();
                renderShowtimeList(date.id);
            };
            card.innerHTML = `<span class="label">กำหนดการวันฉาย</span><h2>${date.text}</h2>`;
            container.appendChild(card);
        });
    };

    window.renderShowtimeList = (dateId) => {
        const display = document.getElementById('showtimeDataDisplay');
        if (!display) return;
        display.innerHTML = ''; 

        const allData = JSON.parse(localStorage.getItem('emerald_showtimes')) || [];
        let filtered = allData.filter(item => item.date === dateId);

        // Mock Data สำหรับ 10 ก.พ. (กรณีไม่มีข้อมูล)
        if (dateId === '2026-02-10' && filtered.length === 0) {
            filtered = [
                { id: 'm1', branch: 'RANGSIT', theater: '1', time: '14:30', price: '450.0', date: '2026-02-10', format: 'DIGITAL 4K' },
                { id: 'm2', branch: 'SILOM', theater: '10', time: '18:00', price: '350.0', date: '2026-02-10', format: 'EXECUTIVE SUITE' },
                { id: 'm3', branch: 'SILOM', theater: '10', time: '21:30', price: '350.0', date: '2026-02-10', format: 'EXECUTIVE SUITE' }
            ];
        }

        if (filtered.length === 0) {
            display.innerHTML = `<div style="text-align:center; padding:50px; color:gray;">ไม่มีรอบฉายสำหรับวันที่เลือก</div>`;
            return;
        }

        // Grouping: Branch -> Format -> Theater
        const groupedData = {};
        filtered.forEach(item => {
            const branch = item.branch;
            const format = item.format || 'DIGITAL 2D';
            const theater = item.theater;

            if (!groupedData[branch]) groupedData[branch] = {};
            if (!groupedData[branch][format]) groupedData[branch][format] = {};
            if (!groupedData[branch][format][theater]) groupedData[branch][format][theater] = [];
            
            groupedData[branch][format][theater].push(item);
        });

        for (const branchName in groupedData) {
            let branchHtml = `<div class="location-group"><h2 class="location-title">${branchName}</h2>`;
            
            for (const formatName in groupedData[branchName]) {
                for (const theaterNo in groupedData[branchName][formatName]) {
                    const showtimes = groupedData[branchName][formatName][theaterNo];
                    
                    // --- ส่วนที่แก้ไข: การเรียงลำดับ (Time & Price) ---
                    showtimes.sort((a, b) => {
                        const timeComp = a.time.localeCompare(b.time);
                        if (timeComp !== 0) return timeComp;
                        return parseFloat(a.price) - parseFloat(b.price);
                    });

                    branchHtml += `
                        <div class="theater-card">
                            <div class="theater-header">
                                <span>Theater ${theaterNo}</span>
                                <span class="format">${formatName}</span>
                            </div>
                            <div class="showtime-list">`;
                    
                    showtimes.forEach(item => {
                        branchHtml += `
                            <div class="showtime-item">
                                <div class="time-box highlight">${item.time}</div>
                                <div class="price-info">
                                    <span class="price-label">PRICE</span>
                                    <span class="price-value">${parseFloat(item.price).toLocaleString()} บาท</span>
                                </div>
                                <button class="delete-btn" onclick="deleteItem('${item.id}')">🗑️</button>
                            </div>`;
                    });
                    branchHtml += `</div></div>`;
                }
            }
            branchHtml += `</div>`;
            display.insertAdjacentHTML('beforeend', branchHtml);
        }
    };

    // --- แก้ไขจุดที่ 1: ปุ่ม FAB (มุมขวาล่าง) ให้วาร์ปไปหน้าเพิ่มทันที ---
    const fabBtn = document.querySelector('.fab-calendar-btn');
    if (fabBtn) {
        fabBtn.onclick = () => {
            // วาร์ปไปหน้า Add โดยแนบวันที่ปัจจุบันที่เลือกอยู่ไปด้วย
            window.location.href = `addShowtime.html?date=${currentSelectedDateId}`;
        };
    }

    // ฟังก์ชัน Overlay ปกติ
    window.openOverlay = () => document.getElementById('showtimeOverlay').style.display = 'flex';
    window.closeOverlay = () => document.getElementById('showtimeOverlay').style.display = 'none';

    // --- แก้ไขจุดที่ 2: เพิ่มวันใหม่แล้วให้อยู่หน้าเดิม โชว์หน้าว่างๆ ---
    window.submitNewShowtime = () => {
        const val = document.getElementById('showtimeDate').value;
        if (val) {
            const dateObj = new Date(val);
            const ThaiMonth = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
            const txt = `${dateObj.getDate()} ${ThaiMonth[dateObj.getMonth()]} ${dateObj.getFullYear() + 543}`;
            
            if (!dateList.some(d => d.id === val)) {
                dateList.push({ id: val, text: txt });
                localStorage.setItem('emerald_dates', JSON.stringify(dateList));
            }
            
            // เปลี่ยนไปเลือกวันที่เพิ่มใหม่ทันที
            currentSelectedDateId = val;
            renderDateCards();
            renderShowtimeList(val); // จะโชว์ "ไม่มีรอบฉาย" เพราะยังไม่ได้กดเพิ่มโรง
            closeOverlay();
            
            // *** ลบส่วนที่ window.location.href วาร์ปไปหน้าอื่นออกแล้ว ***
        }
    };

    window.deleteItem = (id) => {
        if (confirm('ลบรอบฉายนี้?')) {
            let allData = JSON.parse(localStorage.getItem('emerald_showtimes')) || [];
            allData = allData.filter(i => String(i.id) !== String(id));
            localStorage.setItem('emerald_showtimes', JSON.stringify(allData));
            renderShowtimeList(currentSelectedDateId);
        }
    };

    renderDateCards();
    renderShowtimeList(currentSelectedDateId);
});