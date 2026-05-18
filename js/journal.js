// ===== MOCK ДАННЫЕ =====
// потом можно заменить на API или LocalStorage
let entries = [
    {
        id: 1,
        mood: 3,
        date: "2026-03-11 10:15",
        note: "Обычный рабочий день"
    },
    {
        id: 2,
        mood: 5,
        date: "2026-03-10 18:30",
        note: "Отличный день! Встретился с друзьями"
    },
    {
        id: 3,
        mood: 1,
        date: "2026-03-09 08:00",
        note: "Не выспался, голова болит"
    }
];


// ===== ЭЛЕМЕНТЫ =====
const entriesList = document.getElementById("entriesList");
const searchInput = document.getElementById("searchInput");
const clearSearch =
    document.getElementById("clearSearch");
const searchResultInfo =
    document.getElementById("searchResultInfo");

// ===== МОДАЛКА РЕДАКТИРОВАНИЯ =====
const modal =
    document.getElementById("modal");
const editText =
    document.getElementById("editText");
const editMood =
    document.getElementById("editMood");
const saveBtn =
    document.getElementById("saveBtn");
const modalCloseBtn =
    document.getElementById("modalCloseBtn");

// ===== МОДАЛКА УДАЛЕНИЯ =====
const deleteModal =
    document.getElementById("deleteModal");
const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");

// ===== КНОПКИ ФИЛЬТРА =====
const filterButtons =
    document.querySelectorAll(".mood-filter-btn");

// ===== СОСТОЯНИЕ =====
let currentFilter = "all";
let currentEditId = null;
let currentDeleteId = null;

// ===== ЭМОДЗИ =====
const moodEmoji = {
    1: "😢",
    2: "😐",
    3: "🙂",
    4: "😊",
    5: "😁"
};

// ===== РЕНДЕР ЗАПИСЕЙ =====
function renderEntries(data = entries) {
    entriesList.innerHTML = "";
    // ПУСТО
    if (data.length === 0) {
        entriesList.innerHTML = `
      <div class="empty">
        Ничего не найдено
      </div>
    `;
        return;
    }

    // СОЗДАНИЕ КАРТОЧЕК
    data.forEach(entry => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <div class="icon m${entry.mood}">
        ${moodEmoji[entry.mood]}
      </div>
      <div class="content">
        <div class="top">
          <div>
            <div class="date">
              ${formatDate(entry.date)}
            </div>
            <div class="title">
              Настроение: ${entry.mood}/5
            </div>
          </div>
          <div class="actions">

            <button
              class="btn edit-btn"
              data-id="${entry.id}"
            >
              ✏️
            </button>

            <button
              class="btn delete-btn"
              data-id="${entry.id}"
            >
              🗑️
            </button>
          </div>
        </div>
        <div class="note">
          ${entry.note}
        </div>
      </div>
    `;
        entriesList.appendChild(card);
    });
    attachEvents();

}


// ===== ФОРМАТ ДАТЫ =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"

    });

}


// ===== ПОИСК =====
function searchEntries() {
    const query =
        searchInput.value.toLowerCase().trim();
    let filtered = entries.filter(entry => {

        // ПОИСК ПО ЗАМЕТКЕ
        const noteMatch =
            entry.note.toLowerCase()
                .includes(query);

        // ПОИСК ПО ДАТЕ
        const dateMatch =
            formatDate(entry.date)
                .toLowerCase()
                .includes(query);

        // ПОИСК ПО НАСТРОЕНИЮ
        const moodMatch =
            String(entry.mood)
                .includes(query);

        const matchesSearch =
            noteMatch ||
            dateMatch ||
            moodMatch;

        // ФИЛЬТР ПО НАСТРОЕНИЮ
        const matchesMood =
            currentFilter === "all" ||
            String(entry.mood) === currentFilter;
        return matchesSearch && matchesMood;

    });

    renderEntries(filtered);
    searchResultInfo.textContent =
        `Найдено записей: ${filtered.length}`;

}

// ===== ФИЛЬТРЫ =====
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(button => {
            button.classList.remove("active");
        });
        btn.classList.add("active");
        currentFilter = btn.dataset.mood;
        searchEntries();

    });

});


// ===== ОЧИСТКА ПОИСКА =====
clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    searchEntries();

});

// ===== ВВОД ПОИСКА =====
searchInput.addEventListener(
    "input",
    searchEntries
);


// ===== EVENTS =====
function attachEvents() {
    // ===== РЕДАКТИРОВАНИЕ =====
    document.querySelectorAll(".edit-btn")
        .forEach(btn => {
            btn.addEventListener("click", () => {
                const id =
                    Number(btn.dataset.id);
                const entry = entries.find(
                    e => e.id === id
                );
                currentEditId = id;
                editText.value = entry.note;
                editMood.value = entry.mood;
                modal.classList.remove("hidden");
            });
        });


    // ===== УДАЛЕНИЕ =====
    document.querySelectorAll(".delete-btn")
        .forEach(btn => {
            btn.addEventListener("click", () => {
                currentDeleteId =
                    Number(btn.dataset.id);
                deleteModal.classList.remove("hidden");
            });
        });
}


// ===== СОХРАНЕНИЕ =====
saveBtn.addEventListener("click", () => {
    const entry = entries.find(
        e => e.id === currentEditId
    );
    if (!entry) return;
    entry.note = editText.value;
    entry.mood =
        Number(editMood.value);
    modal.classList.add("hidden");
    searchEntries();
});

// ===== ЗАКРЫТЬ РЕДАКТИРОВАНИЕ =====
modalCloseBtn.addEventListener("click", () => {
    modal.classList.add("hidden");

});

// ===== ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ =====
confirmDeleteBtn.addEventListener("click", () => {
    entries = entries.filter(
        entry => entry.id !== currentDeleteId
    );
    deleteModal.classList.add("hidden");
    searchEntries();
});


// ===== ОТМЕНА УДАЛЕНИЯ =====
cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.classList.add("hidden");
});

// ===== ПЕРВЫЙ РЕНДЕР =====
renderEntries();