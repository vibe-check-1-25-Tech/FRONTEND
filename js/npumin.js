
// =========================
// REMINDER
// =========================
const reminderTime = document.getElementById("reminderTime");
const addReminderBtn = document.getElementById("addReminderBtn");
const remindersList = document.getElementById("remindersList");
const requestPermissionBtn = document.getElementById("requestPermissionBtn");

const dayButtons = document.querySelectorAll(".day-btn");

// =========================
// DATA
// =========================
let selectedDays = [];

let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

// =========================
// DAYS BUTTONS
// =========================
dayButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const day = Number(btn.dataset.day);

        btn.classList.toggle("active");

        if (selectedDays.includes(day)) {
            selectedDays = selectedDays.filter(d => d !== day);
        } else {
            selectedDays.push(day);
        }
    });
});

// =========================
// ADD REMINDER
// =========================
addReminderBtn.addEventListener("click", () => {
    const time = reminderTime.value;

    if (!time) {
        alert("Выберите время");
        return;
    }

    if (selectedDays.length === 0) {
        alert("Выберите хотя бы один день");
        return;
    }

    const reminder = {
        id: Date.now(),
        time: time,
        days: [...selectedDays]
    };

    reminders.push(reminder);

    saveReminders();

    renderReminders();

    // reset
    selectedDays = [];

    dayButtons.forEach(btn => {
        btn.classList.remove("active");
    });

    reminderTime.value = "19:00";
});

// =========================
// SAVE
// =========================
function saveReminders() {
    localStorage.setItem("reminders", JSON.stringify(reminders));
}

// =========================
// FORMAT DAYS
// =========================
function formatDays(days) {
    const names = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    return days
        .sort((a, b) => a - b)
        .map(day => names[day])
        .join(", ");
}

// =========================
// RENDER
// =========================
function renderReminders() {
    remindersList.innerHTML = "";

    if (reminders.length === 0) {
        remindersList.innerHTML = `
      <div class="empty-reminders">
        <i class="fas fa-bell-slash"></i>
        <p>Напоминаний пока нет</p>
      </div>
    `;
        return;
    }

    reminders.forEach(reminder => {
        const item = document.createElement("div");

        item.className = "reminder-item";

        item.innerHTML = `
      <div class="reminder-info">
        <div class="reminder-time">
          ${reminder.time}
        </div>

        <div class="reminder-days">
          ${formatDays(reminder.days)}
        </div>
      </div>

      <button class="delete-reminder" data-id="${reminder.id}">
        <i class="fas fa-trash"></i>
      </button>
    `;

        remindersList.appendChild(item);
    });

    // delete
    const deleteButtons = document.querySelectorAll(".delete-reminder");

    deleteButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);

            reminders = reminders.filter(r => r.id !== id);

            saveReminders();

            renderReminders();
        });
    });
}

// =========================
// NOTIFICATION PERMISSION
// =========================
if (requestPermissionBtn) {
    requestPermissionBtn.addEventListener("click", async () => {
        if (!("Notification" in window)) {
            alert("Ваш браузер не поддерживает уведомления");
            return;
        }

        try {
            const permission = await Notification.requestPermission();

            if (permission === "granted") {
                alert("Уведомления включены");
            } else {
                alert("Разрешение не выдано");
            }
        } catch (error) {
            console.error(error);
        }
    });
}

// =========================
// SHOW NOTIFICATION
// =========================
function showNotification() {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification("Vibe Check", {
            body: "Не забудьте сделать запись ✍️",
            icon: "../img/logo.png"
        });
    }
}

// =========================
// CHECK REMINDERS
// =========================
function checkReminders() {
    const now = new Date();

    let currentDay = now.getDay();

    // JS:
    // Sunday = 0
    // Monday = 1

    currentDay = currentDay === 0 ? 6 : currentDay - 1;

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const currentTime = `${hours}:${minutes}`;

    reminders.forEach(reminder => {
        const isCorrectTime = reminder.time === currentTime;

        const isCorrectDay = reminder.days.includes(currentDay);

        if (isCorrectTime && isCorrectDay) {
            showNotification();
        }
    });
}

// =========================
// INIT
// =========================
renderReminders();

// check every minute
setInterval(checkReminders, 60000);

// first check
checkReminders();

console.log("npumin.js подключен");