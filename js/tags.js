// tags.js

// ===== ЭЛЕМЕНТЫ =====
const addBtn = document.querySelector(".form button");
const input = document.querySelector(".form input");
const grid = document.querySelector(".grid");

// ===== ДОБАВЛЕНИЕ ТЕГА =====
addBtn.addEventListener("click", addTag);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTag();
    }
});

function addTag() {
    const tagName = input.value.trim();

    if (tagName === "") {
        alert("Введите название тега");
        return;
    }

    const tagCard = document.createElement("div");
    tagCard.classList.add("tag-card");

    tagCard.innerHTML = `
    <div class="tag-top">

      <div class="tag-left">
        <div class="icon">🏷️</div>
        <div class="tag-name">${tagName}</div>
      </div>

      <div class="dots-wrapper">
        <div class="dots">⋯</div>

        <div class="menu">
          <div class="edit-btn">Изменить</div>
          <div class="delete-btn">Удалить</div>
        </div>
      </div>

    </div>

    <div class="tag-bottom">Использовано 0 раз</div>
  `;

    grid.prepend(tagCard);

    input.value = "";

    initCardEvents(tagCard);
}

// ===== СОБЫТИЯ КАРТОЧКИ =====
function initCardEvents(card) {
    const dots = card.querySelector(".dots");
    const menu = card.querySelector(".menu");

    const editBtn = card.querySelector(".edit-btn");
    const deleteBtn = card.querySelector(".delete-btn");

    // Открытие меню
    dots.addEventListener("click", (e) => {
        e.stopPropagation();

        // закрыть все меню
        document.querySelectorAll(".menu").forEach((m) => {
            if (m !== menu) {
                m.classList.remove("show");
            }
        });

        menu.classList.toggle("show");
    });

    // Удаление
    deleteBtn.addEventListener("click", () => {
        const confirmDelete = confirm("Удалить тег?");

        if (confirmDelete) {
            card.remove();
        }
    });

    // Изменение
    editBtn.addEventListener("click", () => {
        const tagNameElement = card.querySelector(".tag-name");

        const oldName = tagNameElement.textContent;

        const newName = prompt("Новое название тега:", oldName);

        if (newName && newName.trim() !== "") {
            tagNameElement.textContent = newName.trim();
        }
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ СТАРЫХ КАРТОЧЕК =====
document.querySelectorAll(".tag-card").forEach((card) => {
    initCardEvents(card);
});

// ===== ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ ВНЕ =====
document.addEventListener("click", () => {
    document.querySelectorAll(".menu").forEach((menu) => {
        menu.classList.remove("show");
    });
});