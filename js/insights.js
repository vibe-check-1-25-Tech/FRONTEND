// ===== DATA =====

let allData = [];


// ===== ELEMENTS =====

const filterButtons =
    document.querySelectorAll(".filter-btn");

const avgMood =
    document.getElementById("avgMood");


// ===== COLORS =====

const moodColors = {

    1: "#ef4444",
    2: "#f97316",
    3: "#eab308",
    4: "#84cc16",
    5: "#22c55e"

};


// ===== API =====

async function getAllMoods() {

    try {

        return await fetch(
            "http://localhost:8080/api/moods"
        );

    } catch (error) {

        console.error(
            "GET MOODS ERROR:",
            error
        );

        return null;
    }

}


// ===== LINE CHART =====

const lineChart = new Chart(

    document.getElementById("lineChart"),

    {

        type: "line",

        data: {

            labels: [],

            datasets: [

                {

                    label: "Настроение",

                    data: [],

                    borderColor: "#6366f1",

                    backgroundColor:
                        "rgba(99,102,241,0.2)",

                    tension: 0.4,

                    fill: true,

                    pointRadius: 5,

                    pointHoverRadius: 7

                }

            ]

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

            datasets: [

                {

                    data: [],

                    backgroundColor: [

                        moodColors[1],
                        moodColors[2],
                        moodColors[3],
                        moodColors[4],
                        moodColors[5]

                    ]

                }

            ]

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

                                    (a, b) =>
                                        a + b,

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

                            return `${context.label}: ${percent}%`;

                        }

                    }

                }

            }

        }

    }

);


// ===== LOAD DATA =====

async function loadAnalytics() {

    try {

        console.log(
            "Загрузка аналитики..."
        );

        const response =
            await getAllMoods();

        console.log(
            "RESPONSE:",
            response
        );

        if (!response) {

            throw new Error(
                "Сервер недоступен"
            );

        }

        if (!response.ok) {

            throw new Error(
                "Ошибка загрузки"
            );

        }

        const moods =
            await response.json();

        console.log(
            "MOODS:",
            moods
        );

        allData = moods.map(

            (item, index) => ({

                id: item.id,

                day: index + 1,

                mood: item.score,

                date: new Date(
                    item.timestamp
                )

            })

        );

        console.log(
            "ALL DATA:",
            allData
        );

        updateCharts(3);

    } catch (error) {

        console.error(
            "ANALYTICS ERROR:",
            error
        );

        avgMood.textContent =
            "Ошибка";

    }

}


// ===== UPDATE CHARTS =====

function updateCharts(days) {

    const filtered =
        allData.slice(-days);

    if (!filtered.length) {

        lineChart.data.labels = [];

        lineChart.data.datasets[0].data = [];

        lineChart.update();

        pieChart.data.datasets[0].data =

            [0, 0, 0, 0, 0];

        pieChart.update();

        avgMood.textContent = "0";

        return;
    }


    // ===== LINE =====

    lineChart.data.labels =

        filtered.map(

            d => `#${d.day}`

        );

    lineChart.data.datasets[0].data =

        filtered.map(

            d => d.mood

        );

    lineChart.update();


    // ===== PIE =====

    const counts =

        [1, 2, 3, 4, 5].map(

            mood => {

                return filtered.filter(

                    d => d.mood === mood

                ).length;

            }

        );

    pieChart.data.datasets[0].data =
        counts;

    pieChart.update();


    // ===== AVG =====

    const avg =

        filtered.reduce(

            (sum, item) =>

                sum + item.mood,

            0

        ) / filtered.length;

    avgMood.textContent =
        avg.toFixed(1);


    // ===== ANIMATION =====

    avgMood.classList.remove(
        "pulse"
    );

    void avgMood.offsetWidth;

    avgMood.classList.add(
        "pulse"
    );

}


// ===== FILTERS =====

filterButtons.forEach(btn => {

    btn.addEventListener(

        "click",

        () => {

            filterButtons.forEach(button => {

                button.classList.remove(
                    "active"
                );

            });

            btn.classList.add(
                "active"
            );

            const days =

                Number(
                    btn.dataset.days
                );

            updateCharts(days);

        }

    );

});


// ===== INIT =====

loadAnalytics();