// =========================
// CALENDAR LOGIC
// =========================

const calendarHeader = document.querySelector(".calendar-header h2");
const grid = document.querySelector(".calendar-grid");

const prevBtn = document.querySelectorAll(".nav-btn")[0];
const nextBtn = document.querySelectorAll(".nav-btn")[1];

const modal = document.getElementById("dayModal");
const modalDate = document.getElementById("modalDate");

let currentDate = new Date(2026, 3, 1); // Апрель 2026 (месяцы: 0-11)

// =========================
// HELPERS
// =========================
function getMonthName(month) {
    return [
        "Январь", "Февраль", "Март", "Апрель",
        "Май", "Июнь", "Июль", "Август",
        "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ][month];
}

// =========================
// RENDER CALENDAR
// =========================
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    calendarHeader.textContent = `${getMonthName(month)} ${year}`;

    grid.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // JS week starts Sunday -> convert to Monday start
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    // empty cells before first day
    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement("div");
        empty.classList.add("empty");
        grid.appendChild(empty);
    }

    const today = new Date();

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const cell = document.createElement("div");
        cell.classList.add("day");
        cell.textContent = day;

        const cellDate = new Date(year, month, day);

        // highlight today
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today");
        }

        // click handler
        cell.addEventListener("click", () => {
            openModal(cellDate);
        });

        grid.appendChild(cell);
    }
}

// =========================
// MODAL
// =========================
function openModal(date) {
    modal.classList.remove("hidden");
    modalDate.textContent = date.toLocaleDateString("ru-RU");
}

function closeModal() {
    modal.classList.add("hidden");
}

// close on background click
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

// =========================
// NAVIGATION
// =========================
prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// =========================
// INIT
// =========================
renderCalendar();