// =========================
// MOOD SELECT
// =========================

const moods = document.querySelectorAll(".mood");

const moodScores = {
    "Плохо": 1,
    "Не очень": 2,
    "Нормально": 3,
    "Хорошо": 4,
    "Отлично": 5
};

let selectedMood = "Нормально";

moods.forEach((mood) => {

    mood.addEventListener("click", () => {

        // убрать active у всех
        moods.forEach((m) => {
            m.classList.remove("active");
        });

        // добавить active текущему
        mood.classList.add("active");

        // сохранить выбранное настроение
        selectedMood = mood.querySelector("span").textContent.trim();

        console.log("Настроение:", selectedMood);
    });

});



// =========================
// TAGS
// =========================

const tags = document.querySelectorAll(".tag");

let selectedTags = [];

tags.forEach((tag) => {

    // пропускаем кнопку добавления
    if (tag.classList.contains("add-tag-btn")) return;

    tag.addEventListener("click", () => {

        tag.classList.toggle("active");

        const tagText = tag.innerText.trim();

        if (selectedTags.includes(tagText)) {

            selectedTags = selectedTags.filter(t => t !== tagText);

        } else {

            selectedTags.push(tagText);

        }

        console.log("Теги:", selectedTags);
    });

});



// =========================
// TAG MODAL
// =========================

const addTagBtn = document.querySelector(".add-tag-btn");
const tagsBar = document.querySelector(".tags-bar");

const tagModal = document.getElementById("tagModal");
const tagInput = document.getElementById("tagInput");
const saveTagBtn = document.getElementById("saveTagBtn");


// открыть модалку
addTagBtn.addEventListener("click", () => {

    tagModal.classList.add("show");

    tagInput.focus();

});


// закрыть модалку
function closeTagModal() {

    tagModal.classList.remove("show");

    tagInput.value = "";

}


// сохранить тег
saveTagBtn.addEventListener("click", createTag);


// ENTER
tagInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        createTag();

    }

});


// создание нового тега
function createTag() {

    const newTag = tagInput.value.trim();

    if (!newTag) return;

    // проверка на дубликаты
    const existingTags = document.querySelectorAll(".tag");

    for (let tag of existingTags) {

        if (tag.textContent.toLowerCase() === newTag.toLowerCase()) {

            alert("Такой тег уже существует");

            return;
        }

    }

    // создать тег
    const tag = document.createElement("span");

    tag.className = "tag";

    tag.textContent = newTag;

    // вставляем перед кнопкой
    tagsBar.insertBefore(tag, addTagBtn);

    // обработчик клика
    tag.addEventListener("click", () => {

        tag.classList.toggle("active");

        if (selectedTags.includes(newTag)) {

            selectedTags = selectedTags.filter(t => t !== newTag);

        } else {

            selectedTags.push(newTag);

        }

    });

    closeTagModal();

}


// закрытие по фону
tagModal.addEventListener("click", (e) => {

    if (e.target === tagModal) {

        closeTagModal();

    }

});




// =========================
// SAVE ENTRY
// =========================

const saveBtn = document.querySelector(".save-btn");

const textarea = document.querySelector("textarea");

saveBtn.addEventListener("click", saveEntry);


async function saveEntry() {

    const note = textarea.value.trim();

    // объект для backend
    const entry = {

        user_id: 1,
        score: moodScores[selectedMood],
        tags: selectedTags.join(","),
        note: note

    };

    console.log("Отправка:", entry);

    try {

        // createMood() приходит из api.js
        const response = await createMood(entry);

        // сервер недоступен
        if (!response) {

            throw new Error("Сервер недоступен");

        }

        // ошибка сервера
        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(errorText || "Ошибка сервера");

        }

        // JSON ответ
        const result = await response.json();

        console.log("Ответ сервера:", result);

        // если пришла поддержка
        if (result.support) {

            showSupportModal(result.support);

        } else {

            alert("Запись сохранена ✅");

        }

        // очистка формы
        resetForm();

    } catch (error) {

        console.error("Ошибка:", error);

        alert("Ошибка соединения с сервером");

    }

}



// =========================
// RESET FORM
// =========================

function resetForm() {

    // очистить textarea
    textarea.value = "";

    // reset moods
    moods.forEach((m) => {
        m.classList.remove("active");
    });

    document.querySelector(".mood-normal").classList.add("active");

    selectedMood = "Нормально";

    // reset tags
    selectedTags = [];

    document.querySelectorAll(".tag.active").forEach((tag) => {

        tag.classList.remove("active");

    });

}



// =========================
// SUPPORT MODAL
// =========================

function showSupportModal(support) {

    const modal = document.getElementById("supportModal");

    const data = document.getElementById("supportData");

    data.innerHTML = "";

    // joke
    if (support.type === "joke") {

        const p = document.createElement("p");

        p.textContent = support.content;

        data.appendChild(p);

    }

    // image
    else if (support.type === "image") {

        const img = document.createElement("img");

        img.src = `http://localhost:8080${support.content}`;

        img.alt = "Support meme";

        data.appendChild(img);

    }

    modal.style.display = "flex";

}


// закрытие модалки
function closeSupportModal() {

    document.getElementById("supportModal").style.display = "none";

}


// делаем глобальной для HTML onclick
window.closeSupportModal = closeSupportModal;