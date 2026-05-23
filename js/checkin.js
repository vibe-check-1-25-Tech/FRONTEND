
// MOOD SELECT
const moods = document.querySelectorAll(".mood");
let selectedMood = "Норм";
moods.forEach((mood) => {
    mood.addEventListener("click", () => {
        // удалить active у всех
        moods.forEach((m) => m.classList.remove("active"));
        // добавить active текущему
        mood.classList.add("active");
        // сохранить настроение
        selectedMood = mood.textContent.trim();
        console.log("Настроение:", selectedMood);
    });
});


// TAGS
const tags = document.querySelectorAll(".tag");
let selectedTags = [];
tags.forEach((tag) => {
    // пропускаем кнопку добавления
    if (tag.classList.contains("add-tag-btn")) return;
    tag.addEventListener("click", () => {
        tag.classList.toggle("active");
        const tagText = tag.innerText;
        if (selectedTags.includes(tagText)) {
            selectedTags = selectedTags.filter(t => t !== tagText);
        } else {
            selectedTags.push(tagText);
        }
        console.log("Теги:", selectedTags);
    });
});

// TAG MODAL
const addTagBtn = document.querySelector(".add-tag-btn");
const tagsBar = document.querySelector(".tags-bar");

const tagModal = document.getElementById("tagModal");
const tagInput = document.getElementById("tagInput");
const saveTagBtn = document.getElementById("saveTagBtn");

// открыть
addTagBtn.addEventListener("click", () => {
    tagModal.classList.add("show");
    tagInput.focus();
});

// закрыть
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

// создание тега
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

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = newTag;
    tagsBar.insertBefore(tag, addTagBtn);

    // клик по тегу
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

// закрытие по клику вне окна
tagModal.addEventListener("click", (e) => {
    if (e.target === tagModal) {
        closeTagModal();
    }
});

// SAVE ENTRY
const saveBtn = document.querySelector(".save-btn");
const textarea = document.querySelector("textarea");
saveBtn.addEventListener("click", saveEntry);
async function saveEntry() {
    const note = textarea.value.trim();
    if (!note && selectedTags.length === 0) {
        alert("Добавьте запись");
        return
    }
    const entry = {
        user_id: 1,
        mood: selectedMood,
        tags: selectedTags,
        note: note,
    };
    try {
        const response = await fetch("http://localhost:8080/api/logs/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entry)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Ошибка сервера");
        }
        const result = await response.json();
        console.log("Сохранено:", result);
        if (result.support) {
            showSupportModal(result.support);
        } else {
            alert("Запись сохранена ✅");
        }
        resetForm();
    } catch (error) {
        console.error(error);
        alert("Ошибка соединения с сервером");
    }
}


function resetForm() {
    textarea.value = "";
    moods.forEach((m) => m.classList.remove("active"));
    document.querySelector(".mood-normal").classList.add("active");
    selectedMood = "Норм";
    selectedTags = [];
    document.querySelectorAll(".tag.active").forEach(tag => {
        tag.classList.remove("active");
    });
}


function showSupportModal(support) {
    const modal = document.getElementById("supportModal");
    const data = document.getElementById("supportData");
    data.innerHTML = "";
    if (support.type === "joke") {
        const p = document.createElement("p");
        p.textContent = support.content;
        data.appendChild(p);
    } else if (support.type === "meme") {
        const img = document.createElement("img");
        img.src = `http://localhost:8080${support.content}`;
        img.alt = "Support meme";
        data.appendChild(img);
    }
    modal.style.display = "flex";
}

function closeSupportModal() {

    document.getElementById("supportModal").style.display = "none";
}


