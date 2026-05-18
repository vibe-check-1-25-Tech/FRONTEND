// ===== MOCK ДАННЫЕ =====
// потом заменить на API
let allData = Array.from(
    { length: 30 },
    (_, i) => ({
        id: i + 1,
        day: i + 1,
        mood:
            Math.floor(Math.random() * 5) + 1,

        date: new Date(
            2026,
            2,
            i + 1
        )
    })
);

// ===== ЭЛЕМЕНТЫ =====
const filterButtons =
    document.querySelectorAll(".filter-btn");
const avgMood =
    document.getElementById("avgMood");

// ===== ЦВЕТА =====
const moodColors = {
    1: "#ef4444",
    2: "#f97316",
    3: "#eab308",
    4: "#84cc16",
    5: "#22c55e"
};

// ===== LINE CHART =====
const lineChart = new Chart(
    document.getElementById("lineChart"),
    {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Настроение",
                data: [],
                borderColor: "#6366f1",
                backgroundColor:
                    "rgba(99,102,241,0.2)",
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 1,
                    max: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    }
);

// ===== PIE CHART =====
const pieChart = new Chart(
    document.getElementById("pieChart"),
    {
        type: "pie",
        data: {
            labels: [
                "😢 1",
                "😐 2",
                "🙂 3",
                "😊 4",
                "😁 5"
            ],
            datasets: [{
                data: [],
                backgroundColor: [
                    moodColors[1],
                    moodColors[2],
                    moodColors[3],
                    moodColors[4],
                    moodColors[5]
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const data =
                                context.dataset.data;
                            const total =
                                data.reduce(
                                    (a, b) => a + b,
                                    0
                                );
                            const value =
                                context.raw;
                            const percent =
                                total
                                    ? (
                                        value /
                                        total *
                                        100
                                    ).toFixed(1)
                                    : 0;
                            return `
${context.label}: ${percent}%
`;
                        }
                    }
                }
            }
        }
    }
);

// ===== ОБНОВЛЕНИЕ =====
function updateCharts(days) {

    // ПОСЛЕДНИЕ N ДНЕЙ
    const filtered =
        allData.slice(-days);

    // ===== LINE =====
    lineChart.data.labels =
        filtered.map(
            d => `Д${d.day}`
        );
    lineChart.data.datasets[0].data =
        filtered.map(
            d => d.mood
        );
    lineChart.update();

    // ===== PIE =====
    const counts =
        [1,2,3,4,5].map(mood => {
            return filtered.filter(
                d => d.mood === mood
            ).length;
        });
    pieChart.data.datasets[0].data =
        counts;
    pieChart.update();

    // ===== СРЕДНЕЕ =====
    const avg =
        filtered.reduce(
            (sum, item) =>
                sum + item.mood,
            0
        ) / filtered.length;
    avgMood.textContent =
        avg.toFixed(1);

    // ===== АНИМАЦИЯ =====
    avgMood.classList.remove("pulse");
    void avgMood.offsetWidth;
    avgMood.classList.add("pulse");

}

// ===== ФИЛЬТРЫ =====
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // ACTIVE
        filterButtons.forEach(button => {
            button.classList.remove("active");
        });
        btn.classList.add("active");

        // DAYS
        const days =
            Number(btn.dataset.days);
        updateCharts(days);
    });
});

// ===== ПЕРВЫЙ РЕНДЕР =====
updateCharts(3);