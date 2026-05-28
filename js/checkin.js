// =========================
// API FUNCTION
// =========================

async function createMood(entry) {

    try {

        return await fetch(
            "http://localhost:8080/api/moods",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(entry)
            }
        )

    } catch (e) {

        console.error(e)

        return null
    }
}

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // CHECK AUTH
    // =========================

    const token =
        localStorage.getItem("token")

    if (!token) {

        window.location.href =
            "./register.html"

        return
    }

    // =========================
    // MOODS
    // =========================

    const moods =
        document.querySelectorAll(".mood")

    const moodScores = {
        "Плохо": 1,
        "Не очень": 2,
        "Нормально": 3,
        "Хорошо": 4,
        "Отлично": 5
    }

    let selectedMood = "Нормально"

    moods.forEach((mood) => {

        mood.addEventListener("click", () => {

            moods.forEach((m) => {
                m.classList.remove("active")
            })

            mood.classList.add("active")

            selectedMood =
                mood.querySelector("span")
                    .textContent
                    .trim()
        })
    })

    // =========================
    // TAGS
    // =========================

    let selectedTags = []

    document.querySelectorAll(".tag")
        .forEach((tag) => {

            tag.addEventListener("click", () => {

                tag.classList.toggle("active")

                const text =
                    tag.innerText.trim()

                if (selectedTags.includes(text)) {

                    selectedTags =
                        selectedTags.filter(
                            t => t !== text
                        )

                } else {

                    selectedTags.push(text)
                }
            })
        })

    // =========================
    // SAVE
    // =========================

    const saveBtn =
        document.querySelector(".save-btn")

    const textarea =
        document.querySelector("textarea")

    saveBtn.addEventListener(
        "click",
        saveEntry
    )

    async function saveEntry() {

        const note =
            textarea.value.trim()

        const entry = {

            mood:
                moodScores[selectedMood],

            note: note,

            tags: selectedTags
        }

        console.log(
            "Отправка:",
            entry
        )

        try {

            saveBtn.disabled = true

            saveBtn.textContent =
                "Сохранение..."

            const response =
                await createMood(entry)

            if (!response) {

                throw new Error(
                    "Сервер недоступен"
                )
            }

            if (!response.ok) {

                const text =
                    await response.text()

                throw new Error(text)
            }

            const result =
                await response.json()

            console.log(result)

            alert("Настроение сохранено ✅")

            // =========================
            // SUPPORT ONLY FOR BAD MOOD
            // =========================

            if (
                result.support &&
                (
                    selectedMood === "Плохо" ||
                    selectedMood === "Не очень"
                )
            ) {

                showSupportModal(
                    result.support
                )
            }

            resetForm()

        } catch (e) {

            console.error(e)

            alert(
                "Ошибка: " + e.message
            )

        } finally {

            saveBtn.disabled = false

            saveBtn.textContent =
                "Сохранить"
        }
    }

    // =========================
    // RESET
    // =========================

    function resetForm() {

        textarea.value = ""

        selectedTags = []

        document
            .querySelectorAll(".tag.active")
            .forEach((tag) => {

                tag.classList.remove(
                    "active"
                )
            })

        moods.forEach((m) => {
            m.classList.remove("active")
        })

        const normal =
            document.querySelector(
                ".mood-normal"
            )

        if (normal) {

            normal.classList.add(
                "active"
            )
        }

        selectedMood = "Нормально"
    }

    // =========================
    // SUPPORT MODAL
    // =========================

    function showSupportModal(
        support
    ) {

        const modal =
            document.getElementById(
                "supportModal"
            )

        const data =
            document.getElementById(
                "supportData"
            )

        const closeBtn =
            document.getElementById(
                "supportCloseBtn"
            )

        data.innerHTML = ""

        // =========================
        // MEME
        // =========================

        if (
            support.type === "meme"
        ) {

            const img =
                document.createElement(
                    "img"
                )

            img.src =
                "http://localhost:8080" +
                support.content

            img.className =
                "support-image"

            data.appendChild(img)

            const text =
                document.createElement(
                    "p"
                )

            text.innerHTML =
                "Держи мем ❤️"

            text.style.marginTop =
                "16px"

            text.style.textAlign =
                "center"

            text.style.fontSize =
                "18px"

            data.appendChild(text)
        }

        // =========================
        // JOKE
        // =========================

        if (
            support.type === "joke"
        ) {

            const p =
                document.createElement(
                    "p"
                )

            p.textContent =
                support.content

            p.style.fontSize =
                "18px"

            p.style.lineHeight =
                "1.6"

            p.style.whiteSpace =
                "pre-line"

            data.appendChild(p)
        }

        // =========================
        // RANDOM BUTTON TEXT
        // =========================

        const phrases = [

            "Мне полегчало 😌",
            "Спасибо ❤️",
            "Стало лучше 🫶",
            "Подняло настроение ✨",
            "Ещё мем и я счастлив 😭",
            "Улыбнуло 😄"
        ]

        const randomPhrase =
            phrases[
                Math.floor(
                    Math.random() *
                    phrases.length
                )
            ]

        closeBtn.textContent =
            randomPhrase

        modal.style.display = "flex"
    }

    // =========================
    // CLOSE SUPPORT MODAL
    // =========================

    window.closeSupportModal =
        function () {

            document.getElementById(
                "supportModal"
            ).style.display = "none"
        }
})