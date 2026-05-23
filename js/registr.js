document.addEventListener('DOMContentLoaded', function() {
    const avatarUpload = document.querySelector('#avatarUpload');
    const avatarImg = document.getElementById('avatarImg');
    const registerForm = document.querySelector('.register-form');

    // Загрузка аватара
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function(event) {
                    avatarImg.src = event.target.result;
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // Регистрация
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.querySelector('#userName')?.value;
            const email = document.querySelector('#userEmail')?.value;
            const phone = document.querySelector('#userPhone')?.value;
            const password = document.querySelector('#userPassword')?.value;
            const confirmPassword = document.querySelector('#userConfirmPassword')?.value;

            if (!name || !email || !phone || !password) {
                alert('Заполните все поля');
                return;
            }

            if (password !== confirmPassword) {
                alert('Пароли не совпадают');
                return;
            }

            if (password.length < 4) {
                alert('Пароль должен быть не менее 4 символов');
                return;
            }

            // Сохраняем данные
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPhone', phone);

            const avatarSrc = avatarImg?.src || '';

            if (avatarSrc) {
                localStorage.setItem('userAvatar', avatarSrc);
            }

            alert('✅ Регистрация успешна!');

            window.location.href = 'checkin.html';
        });
    }
});