


// ==========================
// НАПОМИНАНИЯ
// ==========================

const addBtn = document.querySelector(".form button");
const timeInput = document.querySelector(".form input");
const list = document.querySelector(".list");


// Загрузка из localStorage
let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

renderReminders();


// Добавление напоминания
addBtn.addEventListener("click", () => {
    const time = timeInput.value;

    if (!time) {
        alert("Выберите время");
        return;
    }

    const reminder = {
        id: Date.now(),
        time: time,
        days: "Каждый день",
        active: true
    };

    reminders.push(reminder);

    saveReminders();
    renderReminders();

    timeInput.value = "18:00";
});


// ==========================
// РЕНДЕР
// ==========================

function renderReminders() {
    list.innerHTML = "";

    reminders.forEach(reminder => {

        const item = document.createElement("div");
        item.className = "item";

        item.innerHTML = `
      <div class="icon">🔔</div>

      <div class="info">
        <div class="time">${reminder.time}</div>
        <div class="days">${reminder.days}</div>
      </div>

      <div class="toggle ${reminder.active ? "active" : ""}">
        <div class="circle"></div>
      </div>

      <button class="delete">🗑</button>
    `;

        // Toggle ON/OFF
        const toggle = item.querySelector(".toggle");

        toggle.addEventListener("click", () => {
            reminder.active = !reminder.active;

            saveReminders();
            renderReminders();
        });

        // Удаление
        const deleteBtn = item.querySelector(".delete");

        deleteBtn.addEventListener("click", () => {
            reminders = reminders.filter(r => r.id !== reminder.id);

            saveReminders();
            renderReminders();
        });

        list.appendChild(item);
    });
}


// ==========================
// LOCAL STORAGE
// ==========================

function saveReminders() {
    localStorage.setItem("reminders", JSON.stringify(reminders));
}


// ==========================
// WEB NOTIFICATIONS
// ==========================

// Разрешение на уведомления
if ("Notification" in window) {
    Notification.requestPermission();
}


// Проверка времени каждую минуту
setInterval(() => {

    const now = new Date();

    const currentTime =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");

    reminders.forEach(reminder => {

        if (
            reminder.active &&
            reminder.time === currentTime
        ) {

            showNotification(reminder.time);

        }

    });

}, 60000);


// Показ уведомления
function showNotification(time) {

    if (Notification.permission === "granted") {

        new Notification("Напоминание ✨", {
            body: `Пора сделать запись (${time})`,
            icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
        });

    }

}