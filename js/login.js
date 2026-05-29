document.addEventListener("DOMContentLoaded", () => {

    const pinInputs = document.querySelectorAll(".login-pin-digit");
    const loginBtn = document.getElementById("loginBtn");
    const errorMessage = document.getElementById("errorMessage");

    // ===== INPUT =====
    pinInputs.forEach((input, index) => {

        input.addEventListener("input", (e) => {

            let value = e.target.value;

            value = value.replace(/\D/g, "");
            e.target.value = value;

            clearError();

            input.classList.remove("error");

            if (value && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }

            if (getPin().length === 4) {
                login();
            }
        });

        input.addEventListener("keydown", (e) => {

            if (e.key === "Backspace" && !input.value && index > 0) {
                pinInputs[index - 1].focus();
            }

        });

    });

    // ===== BUTTON =====
    loginBtn.addEventListener("click", login);

    // ===== ENTER =====
    document.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {
            login();
        }

    });

    // ===== GET PIN =====
    function getPin() {

        return Array.from(pinInputs)
            .map(input => input.value)
            .join("");

    }

    // ===== LOGIN =====
    async function login() {

        const enteredPin = getPin();

        if (enteredPin.length !== 4) {
            return;
        }

        try {

            loginBtn.disabled = true;

            loginBtn.innerHTML =
                `<i class="fas fa-spinner fa-spin"></i> Вход...`;

            // EMAIL берём из localStorage
            const savedEmail =
                localStorage.getItem("userEmail");

            if (!savedEmail) {

                showError("Сначала зарегистрируйтесь");

                resetButton();

                return;
            }
console.log("EMAIL:", localStorage.getItem("userEmail"));
console.log("PIN:", enteredPin);
            const response = await fetch(
                "http://localhost:8080/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: savedEmail,
                        password: enteredPin
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                showError("Неверный PIN-код");

                showInputError();

                clearInputs();

                resetButton();

                return;
            }

            // ===== СОХРАНЯЕМ АВТОРИЗАЦИЮ =====

            localStorage.setItem(
                "isAuthenticated",
                "true"
            );

            localStorage.setItem(
                "userId",
                data.user_id
            );

            loginBtn.innerHTML =
                `<i class="fas fa-check"></i> Успешно`;

            setTimeout(() => {

                window.location.href =
                    "checkin.html";

            }, 700);

        } catch (error) {

            console.error(error);

            showError("Ошибка сервера");

            resetButton();
        }

    }

    // ===== RESET BUTTON =====
    function resetButton() {

        loginBtn.disabled = false;

        loginBtn.innerHTML =
            `<i class="fas fa-arrow-right"></i> Войти`;

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