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

    const savedPin =
        localStorage.getItem("userPin");

    const pinEnabled =
        localStorage.getItem("pinEnabled") === "true";

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

    // PIN
    if (savedPin) {
        document.getElementById("pinInput").value =
            savedPin;
    }

    // TOGGLE
    if (pinToggle) {
        pinToggle.checked = pinEnabled;
    }

    // SHOW/HIDE PIN BOX
    if (pinBox) {

        if (pinEnabled) {
            pinBox.classList.add("show");
        } else {
            pinBox.classList.remove("show");
        }

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

    localStorage.setItem("userName", name);

    localStorage.setItem("userEmail", email);

    localStorage.setItem("userPhone", phone);

    showToast("✅ Профиль сохранен");
}

// =========================
// AVATAR
// =========================
const avatarUpload =
    document.getElementById("avatarUpload");

if (avatarUpload) {

    avatarUpload.addEventListener("change", e => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = event => {

            const avatar =
                document.getElementById("avatarImg");

            avatar.src = event.target.result;

            localStorage.setItem(
                "userAvatar",
                event.target.result
            );

            showToast("✅ Аватар обновлен");

        };

        reader.readAsDataURL(file);

    });

}

// =========================
// PIN
// =========================
const pinToggle =
    document.getElementById("pinToggle");

const pinBox =
    document.getElementById("pinBox");

const pinInput =
    document.getElementById("pinInput");

const pinError =
    document.getElementById("pinError");

const savePinBtn =
    document.getElementById("savePinBtn");

const togglePinEye =
    document.getElementById("togglePinEye");

// VALIDATE
function validatePin(pin) {
    return /^\d{4}$/.test(pin);
}

// ERROR
function showPinError(message, success = false) {

    if (!pinError) return;

    pinError.style.display = "block";

    pinError.style.color =
        success ? "green" : "#dc2626";

    pinError.textContent = message;

    setTimeout(() => {
        pinError.style.display = "none";
    }, 3000);
}

// SAVE PIN
function savePin() {

    const pin =
        pinInput.value.trim();

    // CHECK
    if (!validatePin(pin)) {

        showPinError(
            "PIN должен содержать 4 цифры"
        );

        return;
    }

    // SAVE
    localStorage.setItem("userPin", pin);

    // ENABLE PIN
    localStorage.setItem(
        "pinEnabled",
        "true"
    );

    // ENABLE TOGGLE
    if (pinToggle) {
        pinToggle.checked = true;
    }

    // SHOW BOX
    if (pinBox) {
        pinBox.classList.add("show");
    }

    showPinError(
        "PIN успешно сохранён",
        true
    );

    showToast("✅ PIN сохранен");
}

// TOGGLE EYE
if (togglePinEye) {

    togglePinEye.addEventListener("click", () => {

        const isHidden =
            pinInput.type === "password";

        pinInput.type =
            isHidden
                ? "text"
                : "password";

        togglePinEye.innerHTML =
            isHidden
                ? '<i class="fas fa-eye-slash"></i>'
                : '<i class="fas fa-eye"></i>';

    });

}

// ONLY NUMBERS
if (pinInput) {

    pinInput.addEventListener("input", () => {

        pinInput.value =
            pinInput.value
                .replace(/\D/g, "")
                .slice(0, 4);

    });

}

// TOGGLE PIN
if (pinToggle) {

    pinToggle.addEventListener("change", () => {

        if (pinToggle.checked) {

            pinBox.classList.add("show");

            localStorage.setItem(
                "pinEnabled",
                "true"
            );

            showToast("PIN включен");

        } else {

            pinBox.classList.remove("show");

            localStorage.setItem(
                "pinEnabled",
                "false"
            );

            localStorage.removeItem(
                "userPin"
            );

            pinInput.value = "";

            showToast("PIN отключен");

        }

    });

}

// SAVE PIN BTN
if (savePinBtn) {

    savePinBtn.addEventListener(
        "click",
        savePin
    );

}

// =========================
// STATS
// =========================
function loadStats() {

    const entries =
        JSON.parse(
            localStorage.getItem(
                "globalMoodEntries"
            )
        ) || [];

    const total =
        entries.length;

    const avg =
        total
            ? (
                entries.reduce(
                    (sum, e) =>
                        sum + Number(e.mood || 0),
                    0
                ) / total
            ).toFixed(1)
            : 0;

    const best =
        total
            ? Math.max(
                ...entries.map(e =>
                    Number(e.mood || 0)
                )
            )
            : 0;

    const moodEmoji = {
        1: "😢",
        2: "😐",
        3: "🙂",
        4: "😊",
        5: "😁"
    };

    document.getElementById(
        "totalEntries"
    ).textContent = total;

    document.getElementById(
        "avgMood"
    ).textContent = avg;

    document.getElementById(
        "bestMood"
    ).textContent =
        best
            ? moodEmoji[best]
            : "—";

}

// =========================
// TOAST
// =========================
function showToast(message) {

    const oldToast =
        document.querySelector(".profile-toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast =
        document.createElement("div");

    toast.className =
        "profile-toast";

    toast.innerHTML = `
        <i class="fas fa-info-circle"></i>
        ${message}
    `;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#3b1c5a";
    toast.style.color = "white";
    toast.style.padding = "14px 20px";
    toast.style.borderRadius = "14px";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500);

}

// =========================
// LOGOUT
// =========================
const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const confirmLogout =
            confirm(
                "Выйти из аккаунта?"
            );

        if (confirmLogout) {

            localStorage.removeItem(
                "isAuthenticated"
            );

            window.location.href =
                "login.html";

        }

    });

}

// =========================
// SAVE PROFILE BTN
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
// INIT
// =========================
loadProfileData();

loadStats();