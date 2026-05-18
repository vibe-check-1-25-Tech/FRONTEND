// ===== MOCK ДАННЫЕ =====
// потом заменить на API
let moodEntries = [
    {
        day: 2,
        mood: 5,
        note: "Отличный день"
    },
    {
        day: 5,
        mood: 1,
        note: "Устал и не выспался"
    },
    {
        day: 8,
        mood: 3,
        note: "Обычный день"
    },
    {
        day: 11,
        mood: 4,
        note: "Хорошее настроение"
    },
    {
        day: 15,
        mood: 2,
        note: "Немного тревожно"
    },
    {
        day: 18,
        mood: 5,
        note: "Встретился с друзьями"
    },
    {
        day: 22,
        mood: 4,
        note: "Продуктивный день"
    }
];

// ===== ЭЛЕМЕНТЫ =====
const calendarGrid =
    document.getElementById("calendarGrid");
const currentMonthYear =
    document.getElementById("currentMonthYear");
const prevMonthBtn =
    document.getElementById("prevMonthBtn");
const nextMonthBtn =
    document.getElementById("nextMonthBtn");

// ===== МОДАЛКА =====
const dayModal =
    document.getElementById("dayModal");
const modalDate =
    document.getElementById("modalDate");
const modalMood =
    document.getElementById("modalMood");
const modalNote =
    document.getElementById("modalNote");
const closeModalBtn =
    document.getElementById("closeModalBtn");

// ===== ДАТА =====
let currentDate = new Date();

// ===== ЭМОДЗИ =====
const moodEmoji = {
    1: "😢",
    2: "😐",
    3: "🙂",
    4: "😊",
    5: "😁"
};

// ===== НАЗВАНИЯ МЕСЯЦЕВ =====
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

// ===== РЕНДЕР КАЛЕНДАРЯ =====
function renderCalendar() {
    calendarGrid.innerHTML = "";
    const year =
        currentDate.getFullYear();
    const month =
        currentDate.getMonth();

    // ===== ЗАГОЛОВОК =====
    currentMonthYear.textContent =
        `${monthNames[month]} ${year}`;

    // ===== ПЕРВЫЙ ДЕНЬ =====
    const firstDay =
        new Date(year, month, 1);
    let startDay =
        firstDay.getDay();

    // Воскресенье -> 7
    startDay =
        startDay === 0 ? 7 : startDay;

    // ===== ДНЕЙ В МЕСЯЦЕ =====
    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    // ===== ПУСТЫЕ ЯЧЕЙКИ =====
    for (
        let i = 1;
        i < startDay;
        i++
    ) {

        const empty =
            document.createElement("div");
        empty.className =
            "calendar-empty";
        calendarGrid.appendChild(empty);
    }

    // ===== ДНИ =====
    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {
        const dayElement =
            document.createElement("div");
        dayElement.className =
            "calendar-day";
        dayElement.textContent = day;

        // ===== ИЩЕМ НАСТРОЕНИЕ =====
        const entry =
            moodEntries.find(
                item => item.day === day
            );

        // ===== ЕСЛИ ЕСТЬ ДАННЫЕ =====
        if (entry) {
            dayElement.classList.add(
                `mood-${entry.mood}`
            );
            dayElement.innerHTML = `
        <div class="calendar-day-number">
          ${day}
        </div>
        <div class="calendar-day-emoji">
          ${moodEmoji[entry.mood]}
        </div>
      `;

            // ===== МОДАЛКА =====
            dayElement.addEventListener(
                "click",
                () => openModal(entry, day)
            );
        }

        // ===== СЕГОДНЯ =====
        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayElement.classList.add(
                "today"
            );
        }
        calendarGrid.appendChild(
            dayElement
        );
    }

}

// ===== ОТКРЫТЬ МОДАЛКУ =====
function openModal(entry, day) {
    const month =
        currentDate.getMonth();
    const year =
        currentDate.getFullYear();
    modalDate.textContent = `
${day} ${monthNames[month]} ${year}
`;
    modalMood.textContent =
        moodEmoji[entry.mood];
    modalNote.textContent =
        entry.note;
    dayModal.classList.add("active");

}


// ===== ЗАКРЫТЬ =====
closeModalBtn.addEventListener(
    "click",
    () => {
        dayModal.classList.remove(
            "active"
        );
    }
);


// ===== ЗАКРЫТИЕ ПО ФОНУ =====
dayModal.addEventListener(
    "click",
    (e) => {
        if (e.target === dayModal) {
            dayModal.classList.remove(
                "active"
            );
        }

    }
);

// ===== ПРЕДЫДУЩИЙ МЕСЯЦ =====
prevMonthBtn.addEventListener(
    "click",
    () => {
        currentDate.setMonth(
            currentDate.getMonth() - 1
        );
        renderCalendar();

    }
);

// ===== СЛЕДУЮЩИЙ МЕСЯЦ =====
nextMonthBtn.addEventListener(
    "click",
    () => {
        currentDate.setMonth(
            currentDate.getMonth() + 1
        );
        renderCalendar();

    }
);

// ===== ПЕРВЫЙ РЕНДЕР =====
renderCalendar();