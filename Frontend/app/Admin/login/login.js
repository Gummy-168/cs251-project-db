document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // ตัวอย่าง Log ดูค่าที่รับมา
    console.log("Signing in with:", email);

    if(email && password) {
        alert('ยินดีต้อนรับสู่ Emerald Cinema!');
        // ออกจาก login เข้าไปที่ editMovie
        window.location.href = '../editMovie/editMovie.html';
    }
});