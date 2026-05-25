// ===== DATA (БЫЛ MOCK → СТАЛ API) =====
let moodEntries = [];

async function loadCalendarData() {
    try {
        const res = await getMoods();

        if (!res || !res.ok) {
            throw new Error("API error");
        }

        const data = await res.json();

        moodEntries = (data || []).map(item => {
            const date = new Date(item.timestamp);

            return {
                day: date.getDate(),
                mood: item.score,
                note: item.note
            };
        });

        renderCalendar();

    } catch (err) {
        console.error(err);
        moodEntries = [];
        renderCalendar();
    }
}


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

// ===== МЕСЯЦЫ =====
const monthNames = [
    "Январь","Февраль","Март","Апрель",
    "Май","Июнь","Июль","Август",
    "Сентябрь","Октябрь","Ноябрь","Декабрь"
];


// ===== РЕНДЕР КАЛЕНДАРЯ (ТВОЙ КОД 1:1) =====
function renderCalendar() {
    calendarGrid.innerHTML = "";
    const year =
        currentDate.getFullYear();
    const month =
        currentDate.getMonth();

    currentMonthYear.textContent =
        `${monthNames[month]} ${year}`;

    const firstDay =
        new Date(year, month, 1);
    let startDay =
        firstDay.getDay();

    startDay =
        startDay === 0 ? 7 : startDay;

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();

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

        const entry =
            moodEntries.find(
                item => item.day === day
            );

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

            dayElement.addEventListener(
                "click",
                () => openModal(entry, day)
            );
        }

        const today = new Date();

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayElement.classList.add("today");
        }

        calendarGrid.appendChild(dayElement);
    }
}


// ===== ОТКРЫТЬ МОДАЛКУ (ТВОЙ КОД) =====
function openModal(entry, day) {
    const month =
        currentDate.getMonth();
    const year =
        currentDate.getFullYear();

    modalDate.textContent =
        `${day} ${monthNames[month]} ${year}`;

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
        dayModal.classList.remove("active");
    }
);


// ===== ЗАКРЫТИЕ ПО ФОНУ =====
dayModal.addEventListener(
    "click",
    (e) => {
        if (e.target === dayModal) {
            dayModal.classList.remove("active");
        }
    }
);


// ===== МЕСЯЦА =====
prevMonthBtn.addEventListener(
    "click",
    () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    }
);

nextMonthBtn.addEventListener(
    "click",
    () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    }
);


// ===== INIT =====
loadCalendarData();