document.addEventListener('DOMContentLoaded', function () {

    // Цитаты
    const quotes = [
        '💜 Забота о себе — лучшая инвестиция',
        '🌱 Каждый день — новая возможность стать лучше',
        '🌟 Маленькие шаги ведут к большим изменениям',
        '🍃 Позволь себе чувствовать — это нормально',
        '💪 Ты сильнее, чем думаешь',
        '🌸 Сегодня — отличный день для новых начинаний'
    ];

    // Элемент цитаты
    const quoteElement = document.querySelector('.welcome-quote span');

    // Случайная цитата
    if (quoteElement) {

        quoteElement.innerHTML =
            quotes[Math.floor(Math.random() * quotes.length)];

    }

    // Прогресс
    let progress = 0;

    const progressBar = document.getElementById('welcomeProgressBar');

    const loadingText = document.getElementById('welcomeLoadingText');

    // Проверка
    if (!progressBar || !loadingText) return;

    // Анимация загрузки
    const interval = setInterval(() => {

        progress++;

        // Ширина прогресса
        progressBar.style.width = progress + '%';

        // Текст загрузки
        loadingText.textContent = `Загрузка ${progress}%`;

        // Когда загрузка завершена
        if (progress >= 100) {

            clearInterval(interval);

            // Финальный текст
            loadingText.textContent = 'Добро пожаловать 💜';

            // Небольшая пауза
            setTimeout(() => {

                // Переход на главную
                window.location.href = 'checkin.html';

            }, 2500);

        }

    }, 40);

});