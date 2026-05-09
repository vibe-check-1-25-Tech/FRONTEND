
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

menuBtn.addEventListener("click", openSidebar);
closeBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);


/* =========================
   TOAST
========================= */

const toast = document.getElementById("toast");

function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================
   ДАННЫЕ
========================= */

// пример данных
// позже можно заменить на localStorage
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
   EXPORT CSV
========================= */

const exportCSVBtn = document.getElementById("exportCSV");

exportCSVBtn.addEventListener("click", () => {

    let csv = "Дата,Настроение,Заметка\n";

    entries.forEach(item => {
        csv += `${item.date},${item.mood},${item.note}\n`;
    });

    // поддержка русского текста
    const blob = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "vibe-check-data.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("CSV скачан ✅");
});


/* =========================
   EXPORT PDF
========================= */

const exportPDFBtn = document.getElementById("exportPDF");

exportPDFBtn.addEventListener("click", () => {

    let content = `
    <h1>Vibe Check Report</h1>
    <hr>
  `;

    entries.forEach(item => {
        content += `
      <div style="margin-bottom:20px;">
        <h3>${item.date}</h3>
        <p><strong>Настроение:</strong> ${item.mood}</p>
        <p><strong>Заметка:</strong> ${item.note}</p>
      </div>
    `;
    });

    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
    <html>
      <head>
        <title>Export PDF</title>
      </head>
      <body style="font-family:Arial;padding:30px;">
        ${content}
      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.print();

    showToast("PDF готов ✅");
});