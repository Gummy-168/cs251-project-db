document.addEventListener('DOMContentLoaded', () => {
    // --- 1. จัดการข้อมูลสำหรับหน้า Update Movie ---
    if (window.location.pathname.includes('updateMovie.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');

        // ข้อมูลจำลองสำหรับทดสอบ
        const movieData = {
            '0890': {
                name: 'Neon Vanguard',
                rating: '8.5',
                desc: 'In a future where memory is a luxury...'
            },
            '0891': {
                name: 'Emerald Dreams',
                rating: '9.0',
                desc: 'A journey through the crystal forests...'
            }
        };

        // นำข้อมูลไปใส่ใน Input
        if (movieId && movieData[movieId]) {
            const idDisplay = document.getElementById('displayMovieId');
            const nameInput = document.getElementById('editMovieName');
            const ratingInput = document.getElementById('editRating');
            const descInput = document.getElementById('editDescription');

            if(idDisplay) idDisplay.innerText = `#${movieId}`;
            if(nameInput) nameInput.value = movieData[movieId].name;
            if(ratingInput) ratingInput.value = movieData[movieId].rating;
            if(descInput) descInput.value = movieData[movieId].desc;
        }
    }

    // --- 2. จัดการปุ่ม Add Movie (Floating Action Button) ในหน้าหลัก ---
    const addMovieBtn = document.getElementById('addMovieBtn');
    if (addMovieBtn) {
        addMovieBtn.addEventListener('click', () => {
            window.location.href = 'addMovie.html';
        });
    }

    // --- 3. ระบบ Dirty Check และฟอร์ม ---
    let isDirty = false;
    const movieForm = document.querySelector('.add-movie-form');
    const backBtn = document.querySelector('.back-nav');
    const saveBubble = document.getElementById('saveBubble');
    const unsavedOverlay = document.getElementById('unsavedOverlay');

    if (movieForm) {
        // เช็คการพิมพ์ข้อมูล
        movieForm.addEventListener('input', () => {
            isDirty = true;
        });

        // เมื่อกด Save
        movieForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (saveBubble) {
                saveBubble.classList.add('show');
                setTimeout(() => {
                    saveBubble.classList.remove('show');
                }, 3000);
            }
            isDirty = false; // รีเซ็ตสถานะหลัง save
        });
    }

    // จัดการปุ่ม Back
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            if (isDirty) {
                e.preventDefault();
                if (unsavedOverlay) unsavedOverlay.style.display = 'flex';
            } else {
                window.location.href = 'editMovie.html';
            }
        });
    }

    // --- 4. จัดการปุ่มใน Overlay ---
    if (unsavedOverlay) {
        document.getElementById('cancelLeaveBtn').addEventListener('click', () => {
            unsavedOverlay.style.display = 'none';
        });

        document.getElementById('saveLeaveBtn').addEventListener('click', () => {
            unsavedOverlay.style.display = 'none';
            if (saveBubble) {
                saveBubble.classList.add('show');
                setTimeout(() => {
                    window.location.href = 'editMovie.html';
                }, 1000);
            } else {
                window.location.href = 'editMovie.html';
            }
        });
    }
});