// ===== MOCK ДАННЫЕ =====
let tags = [
    {
        id: 1,
        name: "Работа",
        icon: "💼",
        count: 12,
        type: "neutral"
    },
    {
        id: 2,
        name: "Дом",
        icon: "🏠",
        count: 8,
        type: "positive"
    },
    {
        id: 3,
        name: "Спорт",
        icon: "🏃",
        count: 7,
        type: "positive"
    }
];

// ===== ЭЛЕМЕНТЫ =====
const tagsGrid =
    document.getElementById("tagsGrid");
const newTagInput =
    document.getElementById("newTagInput");
const addTagBtn =
    document.getElementById("addTagBtn");
const tagSearchInput =
    document.getElementById("tagSearchInput");
const clearSearchBtn =
    document.getElementById("clearSearchBtn");
const searchResultInfo =
    document.getElementById("searchResultInfo");

// ===== МОДАЛКА РЕДАКТИРОВАНИЯ =====
const editModal =
    document.getElementById("editModal");
const editTagInput =
    document.getElementById("editTagInput");
const saveEditBtn =
    document.getElementById("saveEditBtn");
const cancelEditBtn =
    document.getElementById("cancelEditBtn");

// ===== МОДАЛКА УДАЛЕНИЯ =====
const deleteModal =
    document.getElementById("deleteModal");
const deleteTagName =
    document.getElementById("deleteTagName");
const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");

// ===== СОСТОЯНИЕ =====
let currentEditId = null;
let currentDeleteId = null;

// ===== РЕНДЕР ТЕГОВ =====
function renderTags(data = tags) {
    tagsGrid.innerHTML = "";

    // ПУСТО
    if (data.length === 0) {
        tagsGrid.innerHTML = `
            <div class="empty">
                Теги не найдены
            </div>
        `;
        return;
    }

    // СОЗДАНИЕ КАРТОЧЕК
    data.forEach(tag => {
        const card =
            document.createElement("div");
        card.className =
            `tag-card ${tag.type}`;
        card.innerHTML = `
            <div class="tag-card-content">
                <div class="tag-icon-wrapper ${tag.type}">
                    ${tag.icon}
                </div>
                <div class="tag-info">
                    <div class="tag-name">
                        ${tag.name}
                    </div>
                    <div class="tag-count">
                        ${tag.count} раз
                    </div>
                </div>
                <div class="tag-actions">
                    <button
                        class="tag-edit-btn"
                        data-id="${tag.id}"
                    >
                        ✏️
                    </button>
                    <button
                        class="tag-delete-btn"
                        data-id="${tag.id}"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        `;
        tagsGrid.appendChild(card);
    });
    searchResultInfo.textContent =
        `Всего тегов: ${data.length}`;
}

// ===== ДОБАВЛЕНИЕ ТЕГА =====
addTagBtn.addEventListener("click", () => {
    const value =
        newTagInput.value.trim();
    if (!value) return;
    const newTag = {
        id: Date.now(),
        name: value,
        icon: "🏷️",
        count: 0,
        type: "neutral"
    };
    tags.unshift(newTag);
    newTagInput.value = "";
    renderTags();
});


// ===== ПОИСК =====
function searchTags() {
    const query =
        tagSearchInput.value
            .toLowerCase()
            .trim();
    const filtered =
        tags.filter(tag => {
            return (
                tag.name
                    .toLowerCase()
                    .includes(query)
            );
        });
    renderTags(filtered);
    searchResultInfo.textContent =
        `Найдено тегов: ${filtered.length}`;
}

// ===== ОЧИСТКА ПОИСКА =====
clearSearchBtn.addEventListener(
    "click",
    () => {
        tagSearchInput.value = "";
        renderTags();
    }
);

// ===== ВВОД ПОИСКА =====
tagSearchInput.addEventListener(
    "input",
    searchTags
);

tagsGrid.addEventListener("click", (e) => {

    // РЕДАКТИРОВАТЬ
    if (e.target.classList.contains("tag-edit-btn")) {

        const id = Number(e.target.dataset.id);

        const tag = tags.find(t => t.id === id);

        if (!tag) return;

        currentEditId = id;

        editTagInput.value = tag.name;
        editModal.classList.add("show");
    }

    // УДАЛИТЬ
    if (e.target.classList.contains("tag-delete-btn")) {

        const id = Number(e.target.dataset.id);

        const tag = tags.find(t => t.id === id);

        if (!tag) return;

        currentDeleteId = id;

        deleteTagName.textContent = tag.name;
        deleteModal.classList.add("show");
    }
});
// ===== СОХРАНЕНИЕ =====
saveEditBtn.addEventListener(
    "click",
    () => {
        const tag =
            tags.find(
                t => t.id === currentEditId
            );
        if (!tag) return;
        tag.name =
            editTagInput.value.trim();
        editModal.classList.remove("show");
        renderTags();
    }
);


// ===== ОТМЕНА РЕДАКТИРОВАНИЯ =====
cancelEditBtn.addEventListener(
    "click",
    () => {
        editModal.classList.remove("show");
    }
);

// ===== ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ =====
confirmDeleteBtn.addEventListener(
    "click",
    () => {
        tags = tags.filter(
            tag => tag.id !== currentDeleteId
        );
        deleteModal.classList.remove("show");
        renderTags();
    }
);

// ===== ОТМЕНА УДАЛЕНИЯ =====
cancelDeleteBtn.addEventListener(
    "click",
    () => {
        deleteModal.classList.remove("show");
    }
);

// ===== ENTER ДОБАВЛЕНИЕ =====
newTagInput.addEventListener(
    "keydown",
    e => {
        if (e.key === "Enter") {
            addTagBtn.click();
        }
    }
);

// ===== ПЕРВЫЙ РЕНДЕР =====
renderTags();