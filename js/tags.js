// ===== STATE =====
let tags = [];

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

// ===== МОДАЛКИ =====
const editModal =
    document.getElementById("editModal");

const editTagInput =
    document.getElementById("editTagInput");

const saveEditBtn =
    document.getElementById("saveEditBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const deleteModal =
    document.getElementById("deleteModal");

const deleteTagName =
    document.getElementById("deleteTagName");

const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");

const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");

// ===== STATE =====
let currentEditId = null;
let currentDeleteId = null;


// =======================
// LOAD TAGS
// =======================
async function loadTags() {

    try {

        const result = await getTags();

        console.log("TAGS:", result);

        if (!Array.isArray(result)) {

            tags = [];

        } else {

            tags = result;
        }

        renderTags(tags);

    } catch (err) {

        console.error("LOAD TAGS ERROR:", err);

        tags = [];

        renderTags([]);
    }
}


// =======================
// RENDER
// =======================
function renderTags(data = tags) {

    tagsGrid.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {

        tagsGrid.innerHTML = `
            <div class="empty">
                Теги не найдены
            </div>
        `;

        return;
    }

    data.forEach(tag => {

        const card =
            document.createElement("div");

        card.className =
            `tag-card ${tag.type || "neutral"}`;

        card.innerHTML = `
            <div class="tag-card-content">

                <div class="tag-icon-wrapper ${tag.type || "neutral"}">
                    ${tag.icon || "🏷️"}
                </div>

                <div class="tag-info">
                    <div class="tag-name">
                        ${tag.name || "Без названия"}
                    </div>

                    <div class="tag-count">
                        ${tag.count || 0} раз
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


// =======================
// ADD TAG
// =======================
addTagBtn.addEventListener("click", async () => {

    const value =
        newTagInput.value.trim();

    if (!value) {

        alert("Введите название тега");

        return;
    }

    const newTag = {

        name: value,

        icon: "🏷️",

        type: "neutral",

        count: 0
    };

    console.log("CREATE TAG:", newTag);

    try {

        const result =
            await createTag(newTag);

        console.log("CREATE RESULT:", result);

        if (!result) {

            alert("Ошибка создания тега");

            return;
        }

        newTagInput.value = "";

        await loadTags();

    } catch (err) {

        console.error("CREATE TAG ERROR:", err);

        alert("Ошибка сервера");
    }
});


// ENTER
newTagInput.addEventListener("keydown", async (e) => {

    if (e.key === "Enter") {

        addTagBtn.click();
    }
});


// =======================
// SEARCH
// =======================
async function searchTags() {

    const query =
        tagSearchInput.value
            .trim()
            .toLowerCase();

    if (!query) {

        renderTags(tags);

        return;
    }

    try {

        const results =
            await searchTagsApi(query);

        renderTags(results || []);

        searchResultInfo.textContent =
            `Найдено тегов: ${(results || []).length}`;

    } catch (err) {

        console.error("SEARCH ERROR:", err);
    }
}


// =======================
// CLEAR SEARCH
// =======================
clearSearchBtn.addEventListener("click", async () => {

    tagSearchInput.value = "";

    await loadTags();
});

tagSearchInput.addEventListener(
    "input",
    searchTags
);


// =======================
// EDIT / DELETE BUTTONS
// =======================
tagsGrid.addEventListener("click", (e) => {

    // EDIT
    if (e.target.classList.contains("tag-edit-btn")) {

        const id =
            Number(e.target.dataset.id);

        const tag =
            tags.find(t => t.id === id);

        if (!tag) return;

        currentEditId = id;

        editTagInput.value = tag.name;

        editModal.classList.add("show");
    }

    // DELETE
    if (e.target.classList.contains("tag-delete-btn")) {

        const id =
            Number(e.target.dataset.id);

        const tag =
            tags.find(t => t.id === id);

        if (!tag) return;

        currentDeleteId = id;

        deleteTagName.textContent =
            tag.name;

        deleteModal.classList.add("show");
    }
});


// =======================
// SAVE EDIT
// =======================
saveEditBtn.addEventListener("click", async () => {

    const value =
        editTagInput.value.trim();

    if (!value) return;

    try {

        await updateTag({

            id: currentEditId,

            name: value
        });

        editModal.classList.remove("show");

        await loadTags();

    } catch (err) {

        console.error("UPDATE ERROR:", err);
    }
});


// =======================
// DELETE
// =======================
confirmDeleteBtn.addEventListener("click", async () => {

    try {

        await deleteTag(currentDeleteId);

        deleteModal.classList.remove("show");

        await loadTags();

    } catch (err) {

        console.error("DELETE ERROR:", err);
    }
});


// =======================
// CANCEL
// =======================
cancelEditBtn.addEventListener("click", () => {

    editModal.classList.remove("show");
});

cancelDeleteBtn.addEventListener("click", () => {

    deleteModal.classList.remove("show");
});


// =======================
// INIT
// =======================
loadTags();