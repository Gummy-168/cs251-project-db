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

        if (filtered.length === 0) {
            display.innerHTML = `<div style="text-align:center; padding:50px; color:gray;">ไม่มีรอบฉายสำหรับวันที่เลือก</div>`;
            return;
        }

        // จัดกลุ่มข้อมูลตาม: สาขา -> รูปแบบฉาย -> เลขโรง
        const groupedData = {};
        filtered.forEach(item => {
            const branch = item.branch || "Unknown Branch";
            const format = item.format || 'DIGITAL 2D';
            const theater = item.theater || "1";

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
                    
                    // เรียงเวลา (เช้าไปดึก)
                    showtimes.sort((a, b) => a.time.localeCompare(b.time));

                    branchHtml += `
                        <div class="theater-card">
                            <div class="theater-header">
                                <span>Theater ${theaterNo}</span>
                                <span class="format">${formatName}</span>
                            </div>
                            <div class="showtime-list">`;
                    
                    showtimes.forEach(item => {
                        branchHtml += `
                            <div class="showtime-item" style="display: flex; align-items: center; gap: 15px;">
                                <div class="time-box highlight">${item.time}</div>
                                <div class="movie-info" style="flex: 1;">
                                    <div class="movie-title" style="font-weight: 600; color: #fff;">${item.movieName || 'ไม่ระบุชื่อหนัง'}</div>
                                    <div class="price-value" style="font-size: 0.8rem; color: #4ade80;">${parseFloat(item.price).toLocaleString()} บาท</div>
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
        
        // เรียกใช้ฟังก์ชันค้นหาเผื่อกรณีที่มีตัวอักษรค้างอยู่ในช่อง Search
        filterMovies();
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
    // ฟังก์ชันสำหรับค้นหาหนัง
    window.filterMovies = () => {
        const searchTerm = document.getElementById('movieSearchInput').value.toLowerCase();
        const movieItems = document.querySelectorAll('.showtime-item');
        const theaterCards = document.querySelectorAll('.theater-card');

        movieItems.forEach(item => {
            // ดึงชื่อหนังมาตรวจสอบ (เราจะเพิ่ม class 'movie-title' ในขั้นตอนถัดไป)
            const movieTitleNode = item.querySelector('.movie-title');
            const movieName = movieTitleNode ? movieTitleNode.innerText.toLowerCase() : "";
            
            if (movieName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        // ซ่อนการ์ดโรง (Theater Card) หากไม่มีหนังที่ตรงเงื่อนไขแสดงอยู่เลย
        theaterCards.forEach(card => {
            const visibleItems = card.querySelectorAll('.showtime-item[style*="display: flex"]');
            card.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });
    };
    renderDateCards();
    renderShowtimeList(currentSelectedDateId);
});