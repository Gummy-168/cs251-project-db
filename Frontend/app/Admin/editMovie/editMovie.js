document.addEventListener('DOMContentLoaded', () => {
    const addMovieBtn = document.getElementById('addMovieBtn');

    if (addMovieBtn) {
        addMovieBtn.addEventListener('click', () => {
            // เมื่อคลิกปุ่มบวก ให้เปลี่ยนไปหน้าเพิ่มภาพยนตร์
            window.location.href = 'addMovie.html';
        });
    }
});