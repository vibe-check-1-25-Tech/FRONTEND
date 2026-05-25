document.addEventListener("DOMContentLoaded", () => {

    const pinInputs = document.querySelectorAll(".login-pin-digit");
    const loginBtn = document.getElementById("loginBtn");
    const errorMessage = document.getElementById("errorMessage");

    // Получаем PIN из localStorage
    const savedPin = localStorage.getItem("userPin");

    // ===== INPUT =====
    pinInputs.forEach((input, index) => {

        input.addEventListener("input", (e) => {

            let value = e.target.value;

            // Только цифры
            value = value.replace(/\D/g, "");
            e.target.value = value;

            clearError();

            input.classList.remove("error");

            // Следующий input
            if (value && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }

            // Автовход
            if (getPin().length === 4) {
                login();
            }
        });

        // Backspace
        input.addEventListener("keydown", (e) => {

            if (e.key === "Backspace" && !input.value && index > 0) {
                pinInputs[index - 1].focus();
            }

        });

    });

    // Кнопка
    loginBtn.addEventListener("click", login);

    // Enter
    document.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {
            login();
        }

    });

    // ===== Получить PIN =====
    function getPin() {

        return Array.from(pinInputs)
            .map(input => input.value)
            .join("");

    }

    // ===== LOGIN =====
    function login() {

        const enteredPin = getPin();

        // Если PIN не установлен
        if (!savedPin) {
            showError("Сначала установите PIN в профиле");
            showInputError();
            return;
        }

        // Проверка
        if (enteredPin === savedPin) {

            loginBtn.innerHTML = `<i class="fas fa-check"></i> Успешно`;

            // Авторизация
            localStorage.setItem("isAuthenticated", "true");

            // Переход на главную
            setTimeout(() => {
                window.location.href = "checkin.html";
            }, 700);

        } else {

            showError("Неверный PIN-код");

            showInputError();

            clearInputs();

        }

    }

    // ===== ERROR =====
    function showError(message) {
        errorMessage.textContent = message;
    }

    function clearError() {
        errorMessage.textContent = "";
    }

    // ===== CLEAR =====
    function clearInputs() {

        pinInputs.forEach(input => {
            input.value = "";
        });

        pinInputs[0].focus();

    }

    // ===== ERROR ANIMATION =====
    function showInputError() {

        pinInputs.forEach(input => {

            input.classList.add("error");

            setTimeout(() => {
                input.classList.remove("error");
            }, 300);

        });

    }

});