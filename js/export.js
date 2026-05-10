/* =========================
   SIDEBAR
========================= */

const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
}

function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

if (menuBtn) {
    menuBtn.addEventListener("click", openSidebar);
    closeBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);
}


/* =========================
   TOAST
========================= */

const toast = document.getElementById("toast");

function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* =========================
   ДАННЫЕ
========================= */

// можно заменить на localStorage
const entries = [
    {
        date: "2026-05-10",
        mood: "😊",
        note: "Хороший день"
    },
    {
        date: "2026-05-11",
        mood: "😴",
        note: "Устал после работы"
    }
];


/* =========================
   BACKEND EXPORT
========================= */

async function downloadFile(format) {

    showToast(`Подготовка ${format.toUpperCase()}... ⏳`);

    try {

        // запрос на сервер
        const response = await fetch(
            `http://localhost:8080/api/export/${format}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                // отправляем данные на сервер
                body: JSON.stringify(entries)
            }
        );

        if (!response.ok) {
            showToast("Ошибка экспорта");
            return;
        }

        // получаем файл
        const blob = await response.blob();

        // создаем ссылку
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = `vibe_check_report.${format}`;

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

        showToast("Скачано");

    } catch (error) {

        console.error(error);

        showToast("Бэкенд не отвечает");
    }
}


/* =========================
   EXPORT BUTTONS
========================= */

const exportCSVBtn = document.getElementById("exportCSV");
const exportPDFBtn = document.getElementById("exportPDF");

if (exportCSVBtn) {
    exportCSVBtn.addEventListener("click", () => {
        downloadFile("csv");
    });
}

if (exportPDFBtn) {
    exportPDFBtn.addEventListener("click", () => {
        downloadFile("pdf");
    });
}