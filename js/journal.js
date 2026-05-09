// =========================
// SIDEBAR
// =========================

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// кнопка закрытия sidebar
const sidebarCloseBtn = sidebar.querySelector("#closeBtn");

menuBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("show");
});

sidebarCloseBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);

function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
}


// =========================
// ДАННЫЕ
// =========================

let entries = JSON.parse(localStorage.getItem("journalEntries")) || [
    {
        id: 1,
        mood: 5,
        text: "Сегодня был отличный день ✨",
        date: new Date().toLocaleString("ru-RU")
    },
    {
        id: 2,
        mood: 3,
        text: "Обычный рабочий день",
        date: new Date().toLocaleString("ru-RU")
    }
];


// =========================
// DOM
// =========================

const entriesContainer = document.getElementById("entries");
const searchInput = document.getElementById("search");

const modal = document.getElementById("modal");
const editText = document.getElementById("editText");
const editMood = document.getElementById("editMood");

const saveBtn = document.getElementById("saveBtn");

// ВАЖНО:
// у тебя два id="closeBtn"
// один для sidebar
// второй для modal

const modalCloseBtn =
    document.getElementById("modalCloseBtn");
let currentEditId = null;


// =========================
// EMOJI
// =========================

function getMoodEmoji(mood) {
    switch (Number(mood)) {
        case 1:
            return "😡";
        case 2:
            return "😞";
        case 3:
            return "😐";
        case 4:
            return "🙂";
        case 5:
            return "😄";
        default:
            return "🙂";
    }
}


// =========================
// RENDER
// =========================

function renderEntries(list = entries) {

    entriesContainer.innerHTML = "";

    if (list.length === 0) {
        entriesContainer.innerHTML = `
      <div class="card">
        <div class="content">
          <div class="note">Записей не найдено</div>
        </div>
      </div>
    `;
        return;
    }

    list.forEach(entry => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
      <div class="icon m${entry.mood}">
        ${getMoodEmoji(entry.mood)}
      </div>

      <div class="content">

        <div class="top">

          <div>
            <div class="date">${entry.date}</div>
            <div class="title">
              Настроение: ${entry.mood}/5
            </div>
          </div>

          <div class="actions">
            <button class="btn edit-btn">✏️</button>
            <button class="btn delete-btn">🗑</button>
          </div>

        </div>

        <div class="note">
          ${entry.text}
        </div>

      </div>
    `;

        // EDIT
        card.querySelector(".edit-btn")
            .addEventListener("click", () => openEdit(entry.id));

        // DELETE
        card.querySelector(".delete-btn")
            .addEventListener("click", () => deleteEntry(entry.id));

        entriesContainer.appendChild(card);

    });
}


// =========================
// DELETE
// =========================

function deleteEntry(id) {

    const confirmDelete = confirm("Удалить запись?");

    if (!confirmDelete) return;

    entries = entries.filter(entry => entry.id !== id);

    saveToStorage();
    renderEntries();
}


// =========================
// OPEN EDIT
// =========================

function openEdit(id) {

    const entry = entries.find(item => item.id === id);

    if (!entry) return;

    currentEditId = id;

    editText.value = entry.text;
    editMood.value = entry.mood;

    modal.classList.remove("hidden");
}


// =========================
// CLOSE MODAL
// =========================

function closeModal() {
    modal.classList.add("hidden");
}

modalCloseBtn.addEventListener("click", closeModal);


// =========================
// SAVE EDIT
// =========================

saveBtn.addEventListener("click", () => {

    const entry = entries.find(item => item.id === currentEditId);

    if (!entry) return;

    entry.text = editText.value.trim();
    entry.mood = Number(editMood.value);

    saveToStorage();
    renderEntries();

    closeModal();
});


// =========================
// SEARCH
// =========================

searchInput.addEventListener("input", (e) => {

    const value = e.target.value.toLowerCase();

    const filtered = entries.filter(entry =>
        entry.text.toLowerCase().includes(value)
    );

    renderEntries(filtered);
});


// =========================
// LOCAL STORAGE
// =========================

function saveToStorage() {
    localStorage.setItem(
        "journalEntries",
        JSON.stringify(entries)
    );
}


// =========================
// START
// =========================

renderEntries();