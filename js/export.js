

// =========================
// LOAD DATA
// =========================
function loadExportData() {
    const moodEntries =
        JSON.parse(localStorage.getItem("globalMoodEntries")) || [];

    const total = moodEntries.length;

    const avg = total
        ? (
            moodEntries.reduce((sum, entry) => {
                return sum + Number(entry.mood || 0);
            }, 0) / total
        ).toFixed(1)
        : 0;

    let days = 0;

    if (moodEntries.length > 0) {
        const dates = moodEntries.map(
            entry => new Date(entry.timestamp || entry.date)
        );

        const firstDate = new Date(Math.min(...dates));
        const lastDate = new Date(Math.max(...dates));

        days =
            Math.ceil(
                (lastDate - firstDate) / (1000 * 60 * 60 * 24)
            ) + 1;
    }

    document.getElementById("totalEntries").textContent = total;
    document.getElementById("avgMood").textContent = avg;
    document.getElementById("periodDays").textContent =
        days || total;
}

// =========================
// FORMAT DATE
// =========================
function formatDate(date) {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(
        d.getMonth() + 1
    ).padStart(2, "0")}-${String(d.getDate()).padStart(
        2,
        "0"
    )}`;
}

// =========================
// GET DATA
// =========================
function getAllData() {
    const moodEntries =
        JSON.parse(localStorage.getItem("globalMoodEntries")) || [];

    const userProfile = {
        name: localStorage.getItem("userName") || "Пользователь",
        email: localStorage.getItem("userEmail") || "",
        phone: localStorage.getItem("userPhone") || ""
    };

    return {
        moodEntries,
        userProfile
    };
}

// =========================
// DOWNLOAD FILE
// =========================
function downloadFile(content, fileName, type) {
    const blob = new Blob([content], { type });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

// =========================
// TOAST
// =========================
function showToast(message) {
    const toast = document.createElement("div");

    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#3b1c5a";
    toast.style.color = "white";
    toast.style.padding = "14px 20px";
    toast.style.borderRadius = "12px";
    toast.style.zIndex = "9999";
    toast.style.fontSize = "14px";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// =========================
// EXPORT CSV
// =========================
function exportToCSV() {
    const { moodEntries, userProfile } = getAllData();

    const headers = [
        "Дата",
        "Настроение",
        "Эмодзи",
        "Заметка",
        "Время"
    ];

    const rows = moodEntries.map(entry => [
        entry.date || formatDate(entry.timestamp),
        entry.mood || "",
        entry.emoji || "",
        entry.note || "",
        entry.time || ""
    ]);

    const csvContent = [
        `Экспорт данных Vibe Check`,
        `Пользователь: ${userProfile.name}`,
        `Дата экспорта: ${new Date().toLocaleString()}`,
        "",
        headers.join(","),
        ...rows.map(row =>
            row
                .map(cell => `"${String(cell).replace(/"/g, '""')}"`)
                .join(",")
        )
    ].join("\n");

    downloadFile(
        csvContent,
        `vibe_check_export_${formatDate(new Date())}.csv`,
        "text/csv"
    );

    showToast("✅ CSV файл скачан");
}

// =========================
// EXPORT JSON
// =========================
function exportToJSON() {
    const { moodEntries, userProfile } = getAllData();

    const exportData = {
        exportDate: new Date().toISOString(),
        user: userProfile,
        totalEntries: moodEntries.length,
        entries: moodEntries
    };

    const json = JSON.stringify(exportData, null, 2);

    downloadFile(
        json,
        `vibe_check_export_${formatDate(new Date())}.json`,
        "application/json"
    );

    showToast("✅ JSON файл скачан");
}

// =========================
// EXPORT TXT
// =========================
function exportToTXT() {
    const { moodEntries, userProfile } = getAllData();

    let txt = "";

    txt += "=====================================\n";
    txt += "VIBE CHECK EXPORT\n";
    txt += "=====================================\n\n";

    txt += `Пользователь: ${userProfile.name}\n`;
    txt += `Email: ${userProfile.email}\n`;
    txt += `Дата экспорта: ${new Date().toLocaleString()}\n`;
    txt += `Всего записей: ${moodEntries.length}\n\n`;

    moodEntries.forEach((entry, index) => {
        txt += `Запись #${index + 1}\n`;
        txt += `Дата: ${
            entry.date || formatDate(entry.timestamp)
        }\n`;
        txt += `Настроение: ${entry.mood}\n`;
        txt += `Эмодзи: ${entry.emoji || ""}\n`;
        txt += `Заметка: ${entry.note || ""}\n`;
        txt += `Время: ${entry.time || ""}\n`;

        txt += "\n--------------------------\n\n";
    });

    downloadFile(
        txt,
        `vibe_check_export_${formatDate(new Date())}.txt`,
        "text/plain"
    );

    showToast("✅ TXT файл скачан");
}

// =========================
// EXPORT PDF
// =========================
function exportToPDF() {
    const { moodEntries } = getAllData();

    let text = "VIBE CHECK EXPORT\n\n";

    moodEntries.forEach((entry, index) => {
        text += `#${index + 1}\n`;
        text += `Дата: ${entry.date || ""}\n`;
        text += `Настроение: ${entry.mood || ""}\n`;
        text += `Заметка: ${entry.note || ""}\n\n`;
    });

    const win = window.open("", "_blank");

    win.document.write(`
    <html>
      <head>
        <title>Vibe Check PDF</title>
      </head>
      <body style="font-family: sans-serif; padding: 40px;">
        <pre>${text}</pre>
      </body>
    </html>
  `);

    win.document.close();

    win.print();

    showToast("✅ PDF готов");
}

// =========================
// BUTTONS
// =========================
document
    .getElementById("exportCSVBtn")
    .addEventListener("click", exportToCSV);

document
    .getElementById("exportJSONBtn")
    .addEventListener("click", exportToJSON);

document
    .getElementById("exportTXTBtn")
    .addEventListener("click", exportToTXT);

document
    .getElementById("exportPDFBtn")
    .addEventListener("click", exportToPDF);

// =========================
// INIT
// =========================
loadExportData();

console.log("export.js подключен");