// =========================
// SIDEBAR MENU
// =========================
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeBtn");
const overlay = document.getElementById("overlay");

function openMenu() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
}

function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
}

menuBtn.addEventListener("click", () => {

    if (sidebar.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }

});closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

// =========================
// MOOD SELECT
// =========================
const moods = document.querySelectorAll(".mood");

let selectedMood = "Норм";

moods.forEach((mood) => {
    mood.addEventListener("click", () => {

        // удалить active у всех
        moods.forEach((m) => m.classList.remove("active"));

        // добавить active текущему
        mood.classList.add("active");

        // сохранить настроение
        selectedMood = mood.innerText.trim();

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
    if (tag.classList.contains("add-tag")) return;

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

// =========================
// ADD NEW TAG
// =========================
const addTagBtn = document.querySelector(".add-tag");
const tagsBar = document.querySelector(".tags-bar");

addTagBtn.addEventListener("click", () => {

    const newTag = prompt("Введите название тега");

    if (!newTag || newTag.trim() === "") return;

    const tag = document.createElement("span");

    tag.className = "tag";
    tag.innerText = newTag;

    tagsBar.insertBefore(tag, addTagBtn);

    // логика выбора нового тега
    tag.addEventListener("click", () => {

        tag.classList.toggle("active");

        if (selectedTags.includes(newTag)) {
            selectedTags = selectedTags.filter(t => t !== newTag);
        } else {
            selectedTags.push(newTag);
        }

    });

});

// =========================
// PHOTO PREVIEW
// =========================
const photoInput = document.querySelector('input[type="file"]');

photoInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    let preview = document.querySelector(".photo-preview");

    // если превью нет — создать
    if (!preview) {
        preview = document.createElement("img");
        preview.className = "photo-preview";

        preview.style.width = "100%";
        preview.style.marginTop = "12px";
        preview.style.borderRadius = "14px";

        document.querySelector(".note-box").appendChild(preview);
    }

    preview.src = imageURL;
});

// =========================
// SAVE ENTRY
// =========================
const saveBtn = document.querySelector(".save-btn");
const textarea = document.querySelector("textarea");

saveBtn.addEventListener("click", () => {

    const note = textarea.value.trim();

    const entry = {
        mood: selectedMood,
        tags: selectedTags,
        note: note,
        date: new Date().toLocaleString()
    };

    // получаем старые записи
    const entries = JSON.parse(localStorage.getItem("entries")) || [];

    // добавляем новую
    entries.push(entry);

    // сохраняем
    localStorage.setItem("entries", JSON.stringify(entries));

    console.log("Сохранено:", entry);

    // уведомление
    alert("Запись сохранена ✅");

    // очистка
    textarea.value = "";

    moods.forEach((m) => m.classList.remove("active"));

    document.querySelector(".mood-normal").classList.add("active");

    selectedMood = "Норм";
    selectedTags = [];

    document.querySelectorAll(".tag.active").forEach(tag => {
        tag.classList.remove("active");
    });

});

// =========================
// LOAD ENTRIES (для проверки)
// =========================
const savedEntries = JSON.parse(localStorage.getItem("entries")) || [];

console.log("Все записи:", savedEntries);