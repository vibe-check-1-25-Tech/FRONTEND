
// =========================
// API
// =========================

async function getMoods() {

    try {

        const token =
            localStorage.getItem("token")

        const response =
            await fetch(
                "http://localhost:8080/api/moods",
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    }
                }
            )

        return response

    } catch (e) {

        console.error(
            "GET MOODS ERROR:",
            e
        )

        return null
    }
}


// =========================
// DATA
// =========================

let moodEntries = []


// =========================
// LOAD DATA
// =========================

async function loadCalendarData() {

    try {

        const res =
            await getMoods()

        if (!res || !res.ok) {

            throw new Error(
                "Ошибка API"
            )
        }

        const data =
            await res.json()

        console.log(
            "MOODS:",
            data
        )

        moodEntries =
            (data || []).map(item => {

                const date =
                    new Date(
                        item.timestamp
                    )

                return {

                    id: item.id,

                    day:
                        date.getDate(),

                    month:
                        date.getMonth(),

                    year:
                        date.getFullYear(),

                    mood:
                        item.score,

                    note:
                        item.note || "",

                    tags:
                        item.tags || []
                }
            })

        renderCalendar()

    } catch (err) {

        console.error(
            "CALENDAR ERROR:",
            err
        )

        moodEntries = []

        renderCalendar()
    }
}


// =========================
// ELEMENTS
// =========================

const calendarGrid =
    document.getElementById(
        "calendarGrid"
    )

const currentMonthYear =
    document.getElementById(
        "currentMonthYear"
    )

const prevMonthBtn =
    document.getElementById(
        "prevMonthBtn"
    )

const nextMonthBtn =
    document.getElementById(
        "nextMonthBtn"
    )


// =========================
// MODAL
// =========================

const dayModal =
    document.getElementById(
        "dayModal"
    )

const modalDate =
    document.getElementById(
        "modalDate"
    )

const modalMood =
    document.getElementById(
        "modalMood"
    )

const modalNote =
    document.getElementById(
        "modalNote"
    )

const closeModalBtn =
    document.getElementById(
        "closeModalBtn"
    )


// =========================
// DATE
// =========================

let currentDate =
    new Date()


// =========================
// MOOD EMOJI
// =========================

const moodEmoji = {

    1: "😢",
    2: "😐",
    3: "🙂",
    4: "😊",
    5: "😁"
}


// =========================
// MONTHS
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
]


// =========================
// RENDER CALENDAR
// =========================

function renderCalendar() {

    calendarGrid.innerHTML = ""

    const year =
        currentDate.getFullYear()

    const month =
        currentDate.getMonth()

    currentMonthYear.textContent =
        `${monthNames[month]} ${year}`

    const firstDay =
        new Date(year, month, 1)

    let startDay =
        firstDay.getDay()

    startDay =
        startDay === 0
            ? 7
            : startDay

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate()


    // =========================
    // EMPTY CELLS
    // =========================

    for (
        let i = 1;
        i < startDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            )

        empty.className =
            "calendar-empty"

        calendarGrid.appendChild(
            empty
        )
    }


    // =========================
    // DAYS
    // =========================

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayElement =
            document.createElement(
                "div"
            )

        dayElement.className =
            "calendar-day"

        dayElement.textContent =
            day


        // =========================
        // FIND ENTRY
        // =========================

        const entry =
            moodEntries.find(
                item =>

                    item.day === day &&

                    item.month === month &&

                    item.year === year
            )


        // =========================
        // IF ENTRY EXISTS
        // =========================

        if (entry) {

            dayElement.classList.add(
                `mood-${entry.mood}`
            )

            dayElement.innerHTML = `

                <div class="calendar-day-number">
                    ${day}
                </div>

                <div class="calendar-day-emoji">
                    ${moodEmoji[entry.mood]}
                </div>
            `

            dayElement.addEventListener(
                "click",
                () =>
                    openModal(
                        entry,
                        day
                    )
            )
        }


        // =========================
        // TODAY
        // =========================

        const today =
            new Date()

        if (

            day === today.getDate() &&

            month === today.getMonth() &&

            year === today.getFullYear()
        ) {

            dayElement.classList.add(
                "today"
            )
        }

        calendarGrid.appendChild(
            dayElement
        )
    }
}


// =========================
// OPEN MODAL
// =========================

function openModal(
    entry,
    day
) {

    const month =
        currentDate.getMonth()

    const year =
        currentDate.getFullYear()

    modalDate.textContent =
        `${day} ${monthNames[month]} ${year}`

    modalMood.textContent =
        moodEmoji[entry.mood]

    modalNote.innerHTML = `

        <div class="modal-note">
            ${entry.note || "Без заметки"}
        </div>

        <div class="modal-tags">

            ${
                entry.tags.length > 0

                ? entry.tags
                    .map(tag => `
                        <span class="modal-tag">
                            ${tag}
                        </span>
                    `)
                    .join("")

                : "<span>Тегов нет</span>"
            }

        </div>
    `

    dayModal.classList.add(
        "active"
    )
}


// =========================
// CLOSE MODAL
// =========================

closeModalBtn.addEventListener(
    "click",
    () => {

        dayModal.classList.remove(
            "active"
        )
    }
)


// =========================
// CLOSE BY BACKGROUND
// =========================

dayModal.addEventListener(
    "click",
    (e) => {

        if (e.target === dayModal) {

            dayModal.classList.remove(
                "active"
            )
        }
    }
)


// =========================
// MONTH NAVIGATION
// =========================

prevMonthBtn.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        )

        renderCalendar()
    }
)

nextMonthBtn.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        )

        renderCalendar()
    }
)


// =========================
// INIT
// =========================

loadCalendarData()
