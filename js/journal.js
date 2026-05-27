// =======================
// STATE
// =======================

let entries = [];

let currentFilter = "all";

let currentEditId = null;

let currentDeleteId = null;


// =======================
// ELEMENTS
// =======================

const entriesList =
    document.getElementById("entriesList");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const searchResultInfo =
    document.getElementById("searchResultInfo");


// ===== MODAL EDIT =====

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


// ===== MODAL DELETE =====

const deleteModal =
    document.getElementById("deleteModal");

const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");

const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");


// ===== FILTERS =====

const filterButtons =
    document.querySelectorAll(".mood-filter-btn");


// =======================
// EMOJI
// =======================

const moodEmoji = {

    1: "😢",
    2: "😐",
    3: "🙂",
    4: "😊",
    5: "😁"

};


// =======================
// LOAD DATA
// =======================

async function loadEntries() {

    try {

        const response =
            await getAllMoods();

        if (!response.ok) {

            throw new Error("Ошибка загрузки");

        }

        entries =
            await response.json();

        renderEntries(entries);

    } catch (error) {

        console.error(error);

        entriesList.innerHTML = `
            <div class="empty">
                Ошибка загрузки данных
            </div>
        `;
    }

}


// =======================
// RENDER
// =======================

function renderEntries(data = entries) {

    entriesList.innerHTML = "";

    if (!data.length) {

        entriesList.innerHTML = `
            <div class="empty">
                Ничего не найдено
            </div>
        `;

        return;
    }

    data.forEach(entry => {

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <div class="icon m${entry.score}">
                ${moodEmoji[entry.score]}
            </div>

            <div class="content">

                <div class="top">

                    <div>

                        <div class="date">
                            ${formatDate(entry.timestamp)}
                        </div>

                        <div class="title">
                            Настроение: ${entry.score}/5
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
                    ${entry.note || ""}
                </div>

            </div>
        `;

        entriesList.appendChild(card);

    });

    attachEvents();

}


// =======================
// DATE FORMAT
// =======================

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleString("ru-RU", {

        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"

    });

}


// =======================
// SEARCH
// =======================

async function searchEntries() {

    const query =
        searchInput.value.trim();

    // если пусто
    if (!query) {

        applyFilter(entries);

        return;
    }

    try {

        const response =
            await searchMoods(query);

        if (!response.ok) {

            throw new Error("Ошибка поиска");

        }

        const results =
            await response.json();

        applyFilter(results);

    } catch (error) {

        console.error(error);

    }

}


// =======================
// FILTER
// =======================

function applyFilter(data) {

    let filtered = data;

    if (currentFilter !== "all") {

        filtered = data.filter(entry =>

            String(entry.score) === currentFilter

        );
    }

    renderEntries(filtered);

    searchResultInfo.textContent =
        `Найдено записей: ${filtered.length}`;

}


// =======================
// FILTER BUTTONS
// =======================

filterButtons.forEach(btn => {

    btn.addEventListener("click", async () => {

        filterButtons.forEach(button => {

            button.classList.remove("active");

        });

        btn.classList.add("active");

        currentFilter =
            btn.dataset.mood;

        await searchEntries();

    });

});


// =======================
// CLEAR SEARCH
// =======================

clearSearch.addEventListener("click", () => {

    searchInput.value = "";

    applyFilter(entries);

});


// =======================
// INPUT SEARCH
// =======================

searchInput.addEventListener(
    "input",
    searchEntries
);


// =======================
// EVENTS
// =======================

function attachEvents() {

    // ===== EDIT =====

    document.querySelectorAll(".edit-btn")
        .forEach(btn => {

            btn.addEventListener("click", async () => {

                try {

                    const id =
                        Number(btn.dataset.id);

                    const response =
                        await getMoodById(id);

                    if (!response.ok) {

                        throw new Error("Ошибка");

                    }

                    const entry =
                        await response.json();

                    currentEditId = id;

                    editText.value =
                        entry.note || "";

                    editMood.value =
                        entry.score;

                    modal.classList.remove("hidden");

                } catch (error) {

                    console.error(error);

                    alert("Ошибка загрузки записи");

                }

            });

        });


    // ===== DELETE =====

    document.querySelectorAll(".delete-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                currentDeleteId =
                    Number(btn.dataset.id);

                deleteModal.classList.remove("hidden");

            });

        });

}


// =======================
// SAVE UPDATE
// =======================

saveBtn.addEventListener("click", async () => {

    const updatedData = {

        id: currentEditId,

        score: Number(editMood.value),

        note: editText.value,

        tags: ""

    };

    try {

        const response =
            await updateMood(updatedData);

        if (!response.ok) {

            throw new Error("Ошибка обновления");

        }

        modal.classList.add("hidden");

        await loadEntries();

        await searchEntries();

    } catch (error) {

        console.error(error);

        alert("Ошибка обновления");

    }

});


// =======================
// CLOSE EDIT MODAL
// =======================

modalCloseBtn.addEventListener("click", () => {

    modal.classList.add("hidden");

});


// =======================
// CONFIRM DELETE
// =======================

confirmDeleteBtn.addEventListener("click", async () => {

    try {

        const response =
            await deleteMood(currentDeleteId);

        if (!response.ok) {

            throw new Error("Ошибка удаления");

        }

        deleteModal.classList.add("hidden");

        await loadEntries();

        await searchEntries();

    } catch (error) {

        console.error(error);

        alert("Ошибка удаления");

    }

});


// =======================
// CANCEL DELETE
// =======================

cancelDeleteBtn.addEventListener("click", () => {

    deleteModal.classList.add("hidden");

});


// =======================
// INIT
// =======================

loadEntries();