
// =========================
// GLOBAL STATE
// =========================

let selectedTags = []


// =========================
// API FUNCTIONS
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


async function createTag(tag) {

    try {

        const response = await fetch(
            "http://localhost:8080/api/tags",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(tag)
            }
        )

        if (!response.ok) {

            throw new Error(
                "Ошибка создания тега"
            )
        }

        return await response.json()

    } catch (e) {

        console.error(e)

        return null
    }
}

// =========================
// STATS LOGIC (ДОБАВЛЕНО)
// =========================
async function loadTagsStats() {
    try {
        const response = await fetch("http://localhost:8080/api/tags/stats");
        if (response.ok) {
            const stats = await response.json();
            
            document.querySelectorAll(".tag").forEach(tagElement => {
                // Берем текст тега чисто, без учета цифр, если они там уже есть
                const fullText = tagElement.innerText;
                const tagName = fullText.split('(')[0].trim();
                const count = stats[tagName] || 0;
                
                // Ищем или создаем спан для счетчика
                let countSpan = tagElement.querySelector(".tag-count");
                if (!countSpan) {
                    countSpan = document.createElement("span");
                    countSpan.className = "tag-count";
                    tagElement.appendChild(countSpan);
                }
                // Обновляем только содержимое счетчика, не трогая текст тега
                countSpan.textContent = ` (${count})`;
            });
        }
    } catch (e) {
        console.error("Ошибка загрузки статистики:", e);
    }
}

// =========================
// MAIN
// =========================

document.addEventListener("DOMContentLoaded", () => {
    
    // Загружаем статистику при старте
    loadTagsStats();

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

    let selectedMood =
        "Нормально"

    moods.forEach((mood) => {

        mood.addEventListener(
            "click",
            () => {

                moods.forEach((m) => {

                    m.classList.remove(
                        "active"
                    )
                })

                mood.classList.add(
                    "active"
                )

                selectedMood =
                    mood.querySelector("span")
                        .textContent
                        .trim()
            }
        )
    })


    // =========================
    // TAGS
    // =========================

    document
        .querySelectorAll(".tag")
        .forEach((tag) => {

            tag.addEventListener(
                "click",
                () => {

                    tag.classList.toggle(
                        "active"
                    )

                    const text =
                        tag.innerText.split('(')[0].trim()

                    if (
                        selectedTags.includes(
                            text
                        )
                    ) {

                        selectedTags =
                            selectedTags.filter(
                                t => t !== text
                            )

                    } else {

                        selectedTags.push(
                            text
                        )
                    }
                }
            )
        })


    // =========================
    // SAVE ENTRY
    // =========================

    const saveBtn =
        document.querySelector(
            ".save-btn"
        )

    const textarea =
        document.querySelector(
            "textarea"
        )

    saveBtn.addEventListener(
        "click",
        saveEntry
    )

    async function saveEntry() {

        const note =
            textarea.value.trim()

        const entry = {

            score:
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

            alert(
                "Настроение сохранено ✅"
            )
            
            // ОБНОВЛЯЕМ СТАТИСТИКУ ПОСЛЕ СОХРАНЕНИЯ
            loadTagsStats();

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

            saveBtn.disabled =
                false

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
            .querySelectorAll(
                ".tag.active"
            )
            .forEach((tag) => {

                tag.classList.remove(
                    "active"
                )
            })

        moods.forEach((m) => {

            m.classList.remove(
                "active"
            )
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

        selectedMood =
            "Нормально"
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

        modal.style.display =
            "flex"
    }


    // =========================
    // CLOSE SUPPORT MODAL
    // =========================

    window.closeSupportModal =
        function () {

            document.getElementById(
                "supportModal"
            ).style.display =
                "none"
        }


    // =========================
    // TAG MODAL
    // =========================

    const addTagBtn =
        document.querySelector(
            ".add-tag-btn"
        )

    const tagModal =
        document.getElementById(
            "tagModal"
        )

    const tagInput =
        document.getElementById(
            "tagInput"
        )

    const saveTagBtn =
        document.getElementById(
            "saveTagBtn"
        )


    // OPEN MODAL

    addTagBtn.addEventListener(
        "click",
        () => {

            tagModal.style.display =
                "flex"

            tagInput.focus()
        }
    )


    // CLOSE MODAL

    function closeTagModal() {

        tagModal.style.display =
            "none"

        tagInput.value = ""
    }

    window.closeTagModal =
        closeTagModal


    // SAVE TAG

    saveTagBtn.addEventListener(
        "click",
        async () => {

            const value =
                tagInput.value.trim()

            if (!value) {

                alert(
                    "Введите тег"
                )

                return
            }

            try {

                const createdTag =
                    await createTag({

                        name: value,

                        icon: "🏷️",

                        type: "neutral"
                    })

                console.log(createdTag)

                if (!createdTag) {

                    alert(
                        "Ошибка создания тега"
                    )

                    return
                }


                // =========================
                // CREATE TAG ELEMENT
                // =========================

                const tag =
                    document.createElement(
                        "span"
                    )

                tag.classList.add(
                    "tag",
                    "active"
                )

                tag.textContent =
                    createdTag.name


                // =========================
                // ADD TO PAGE
                // =========================

                const tagsBar =
                    document.querySelector(
                        ".tags-bar"
                    )

                tagsBar.appendChild(tag)


                // =========================
                // ADD TO ARRAY
                // =========================

                selectedTags.push(
                    createdTag.name
                )


                // =========================
                // CLICK EVENT
                // =========================

                tag.addEventListener(
                    "click",
                    () => {

                        tag.classList.toggle(
                            "active"
                        )

                        const text =
                            tag.innerText.split('(')[0].trim()

                        if (
                            selectedTags.includes(
                                text
                            )
                        ) {

                            selectedTags =
                                selectedTags.filter(
                                    t => t !== text
                                )

                        } else {

                            selectedTags.push(
                                text
                            )
                        }
                    }
                )
                
                // ОБНОВЛЯЕМ СТАТИСТИКУ ПРИ ДОБАВЛЕНИИ ТЕГА
                loadTagsStats();

                closeTagModal()

            } catch (e) {

                console.error(e)

                alert(
                    "Ошибка сервера"
                )
            }
        }
    )
})
