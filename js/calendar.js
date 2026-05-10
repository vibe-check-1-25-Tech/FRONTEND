// =========================
// ELEMENTS
// =========================
const calendarHeader = document.querySelector(".calendar-header h2");
const grid = document.querySelector(".calendar-grid");

const prevBtn = document.querySelectorAll(".nav-btn")[0];
const nextBtn = document.querySelectorAll(".nav-btn")[1];

const modal = document.getElementById("dayModal");
const modalDate = document.getElementById("modalDate");

// =========================
// DATE STATE
// =========================
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

let allLogs = [];

// =========================
// MONTH NAMES
// =========================
const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
];

// =========================
// FETCH LOGS
// =========================
async function fetchLogs() {

    try {

        const res = await fetch("http://localhost:8080/api/logs");

        allLogs = await res.json();

    } catch (e) {

        console.error("Ошибка загрузки логов", e);

    }

    renderCalendar();
}

// =========================
// RENDER CALENDAR
// =========================
function renderCalendar() {

    grid.innerHTML = "";

    calendarHeader.textContent =
        `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay =
        new Date(currentYear, currentMonth, 1);

    const lastDay =
        new Date(currentYear, currentMonth + 1, 0);

    // Monday start
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    // EMPTY CELLS
    for (let i = 0; i < startDay; i++) {

        const empty = document.createElement("div");

        empty.classList.add("empty");

        grid.appendChild(empty);
    }

    // TODAY
    const today = new Date();

    // DAYS
    for (let day = 1; day <= lastDay.getDate(); day++) {

        const cell = document.createElement("div");

        cell.classList.add("day");

        cell.textContent = day;

        const cellDate =
            new Date(currentYear, currentMonth, day);

        // FIND LOG
        const log = allLogs.find(l => {

            const logDate = new Date(l.timestamp);

            return (
                logDate.getDate() === day &&
                logDate.getMonth() === currentMonth &&
                logDate.getFullYear() === currentYear
            );
        });

        // HAS LOG
        if (log) {
            cell.classList.add("has-log");
        }

        // TODAY
        if (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ) {
            cell.classList.add("today");
        }

        // CLICK DAY
        cell.addEventListener("click", () => {

            document
                .querySelectorAll(".day")
                .forEach(el => el.classList.remove("selected"));

            cell.classList.add("selected");

            openModal(cellDate, log);
        });

        grid.appendChild(cell);
    }
}

// =========================
// OPEN MODAL
// =========================
function openModal(date, log) {

    modal.classList.remove("hidden");

    if (log) {

        const dt = new Date(log.timestamp);

        const time =
            `${dt.getHours()}:${dt.getMinutes()
                .toString()
                .padStart(2, "0")}`;

        modalDate.innerHTML = `
            <strong>${date.toLocaleDateString("ru-RU")}</strong>
            <br><br>
            ⭐ Оценка: ${log.score}/5
            <br><br>
            📝 ${log.note || "Заметка отсутствует"}
            <br><br>
            ⏰ ${time}
        `;

    } else {

        modalDate.innerHTML = `
            <strong>${date.toLocaleDateString("ru-RU")}</strong>
            <br><br>
            Записей нет
        `;
    }
}

// =========================
// CLOSE MODAL
// =========================
function closeModal() {
    modal.classList.add("hidden");
}

// CLOSE ON BACKGROUND
modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        closeModal();
    }
});

// =========================
// MONTH NAVIGATION
// =========================
prevBtn.addEventListener("click", () => {

    currentMonth--;

    if (currentMonth < 0) {

        currentMonth = 11;
        currentYear--;
    }

    renderCalendar();
});

nextBtn.addEventListener("click", () => {

    currentMonth++;

    if (currentMonth > 11) {

        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
});

// =========================
// INIT
// =========================
fetchLogs();