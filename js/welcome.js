document.addEventListener('DOMContentLoaded', function () {

    const userName = localStorage.getItem('userName') || 'Гость';
    const quoteElement = document.querySelector('.quote span');

    const quotes = [
        '💜 Забота о себе — лучшая инвестиция',
        '🌱 Каждый день — новая возможность стать лучше',
        '🌟 Маленькие шаги ведут к большим изменениям',
        '🍃 Позволь себе чувствовать — это нормально',
        '💪 Ты сильнее, чем думаешь',
        '🌸 Сегодня — отличный день для новых начинаний'
    ];

    if (quoteElement) {
        quoteElement.innerHTML =
            quotes[Math.floor(Math.random() * quotes.length)];
    }

    let progress = 0;
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');

    if (!progressBar || !loadingText) return;

    const interval = setInterval(() => {
        progress++;

        if (progress >= 100) {
            clearInterval(interval);
            progressBar.style.width = '100%';
            loadingText.textContent = 'Загрузка 100%';

            setTimeout(() => {
                window.location.href = 'checkin.html';
            }, 400);

            return;
        }

        progressBar.style.width = progress + '%';
        loadingText.textContent = `Загрузка ${progress}%`;
    }, 50);

});