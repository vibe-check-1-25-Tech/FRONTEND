document.addEventListener('DOMContentLoaded', () => {

    // КНОПКИ
    const startBtn = document.getElementById('welcomeStartBtn');
    const loginBtn = document.getElementById('welcomeLoginBtn');

    // =========================
    // НАЧАТЬ -> РЕГИСТРАЦИЯ
    // =========================
    if (startBtn) {

        startBtn.addEventListener('click', () => {

            window.location.href = 'registr.html';

        });

    }

    // =========================
    // УЖЕ ЕСТЬ АККАУНТ -> ВХОД
    // =========================
    if (loginBtn) {

        loginBtn.addEventListener('click', () => {

            window.location.href = 'login.html';

        });

    }

});