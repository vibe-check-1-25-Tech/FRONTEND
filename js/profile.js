console.log("profile.js подключен");

// =========================
// LOAD PROFILE
// =========================
function loadProfileData() {

    const savedName =
        localStorage.getItem("userName");

    const savedEmail =
        localStorage.getItem("userEmail");

    const savedPhone =
        localStorage.getItem("userPhone");

    const savedAvatar =
        localStorage.getItem("userAvatar");

    // NAME
    if (savedName) {

        document.getElementById("userName").value =
            savedName;

    }

    // EMAIL
    if (savedEmail) {

        document.getElementById("userEmail").value =
            savedEmail;

    }

    // PHONE
    if (savedPhone) {

        document.getElementById("userPhone").value =
            savedPhone;

    }

    // AVATAR
    if (savedAvatar) {

        document.getElementById("avatarImg").src =
            savedAvatar;

    }

}

// =========================
// SAVE PROFILE
// =========================
function saveProfile() {

    const name =
        document.getElementById("userName").value;

    const email =
        document.getElementById("userEmail").value;

    const phone =
        document.getElementById("userPhone").value;

    localStorage.setItem(
        "userName",
        name
    );

    localStorage.setItem(
        "userEmail",
        email
    );

    localStorage.setItem(
        "userPhone",
        phone
    );

    // PASSWORD CHANGE
    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const passwordError =
        document.getElementById("passwordError");

    passwordError.textContent = "";

    if (
        newPassword ||
        confirmPassword
    ) {

        const savedPassword =
            localStorage.getItem("userPassword");

        if (
            currentPassword !== savedPassword
        ) {

            passwordError.textContent =
                "Неверный текущий пароль";

            return;

        }

        if (
            newPassword.length < 4
        ) {

            passwordError.textContent =
                "Минимум 4 символа";

            return;

        }

        if (
            newPassword !== confirmPassword
        ) {

            passwordError.textContent =
                "Пароли не совпадают";

            return;

        }

        localStorage.setItem(
            "userPassword",
            newPassword
        );

    }

    showToast(
        "✅ Профиль сохранен"
    );

    // CLEAR
    document.getElementById("currentPassword").value = "";

    document.getElementById("newPassword").value = "";

    document.getElementById("confirmPassword").value = "";

}

// =========================
// AVATAR
// =========================
const avatarUpload =
    document.getElementById("avatarUpload");

if (avatarUpload) {

    avatarUpload.addEventListener(
        "change",
        e => {

            const file =
                e.target.files[0];

            if (!file) return;

            const reader =
                new FileReader();

            reader.onload = event => {

                const avatar =
                    document.getElementById(
                        "avatarImg"
                    );

                avatar.src =
                    event.target.result;

                localStorage.setItem(
                    "userAvatar",
                    event.target.result
                );

                showToast(
                    "✅ Аватар обновлен"
                );

            };

            reader.readAsDataURL(file);

        }
    );

}

// =========================
// TOAST
// =========================
function showToast(message) {

    const oldToast =
        document.querySelector(
            ".profile-toast"
        );

    if (oldToast) {
        oldToast.remove();
    }

    const toast =
        document.createElement("div");

    toast.className =
        "profile-toast";

    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;

    toast.style.position = "fixed";

    toast.style.bottom = "20px";

    toast.style.right = "20px";

    toast.style.background =
        "#3b1c5a";

    toast.style.color =
        "white";

    toast.style.padding =
        "14px 20px";

    toast.style.borderRadius =
        "14px";

    toast.style.zIndex =
        "9999";

    document.body.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    }, 2500);

}

// =========================
// SAVE BTN
// =========================
const saveProfileBtn =
    document.getElementById(
        "saveProfileBtn"
    );

if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        saveProfile
    );

}

// =========================
// LOGOUT
// =========================
const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "Выйти из аккаунта?"
                );

            if (
                confirmLogout
            ) {

                localStorage.removeItem(
                    "isAuthenticated"
                );

                window.location.href =
                    "login.html";

            }

        }
    );

}

// =========================
// INIT
// =========================
loadProfileData();