async function loadLogs() {
    const list = document.getElementById("entries");
    try {
        // Запрос к твоему бэкенду на Go
        const response = await fetch('http://localhost:8080/api/logs');
        const data = await response.json();

        if (!data || data.length === 0) {
            list.innerHTML = `
                    <div class="empty-state">
                        <p>Здесь пока пусто. Сделай первый чек-ин!</p>
                    </div>`;
            return;
        }

        list.innerHTML = ""; // Очищаем перед загрузкой

        // Выводим записи (новые сверху)
        data.forEach(log => {
            // Обрабатываем дату из поля timestamp
            const dateObj = new Date(log.timestamp);
            const formattedDate = dateObj.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const card = document.createElement("div");
            card.className = "journal-card";

            // Формируем HTML карточки
            // Используем log.score, log.note, log.photo и log.tags (как в твоем Go JSON)
            card.innerHTML = `
                    <div class="log-meta">
                        <div class="log-date">${formattedDate}</div>
                        <div class="log-score">Vibe: ${log.score}/5</div>
                    </div>
                    <div class="log-note">${log.note || "<i>Заметка не оставлена</i>"}</div>
                    ${log.tags ? `<div class="log-tags">#${log.tags}</div>` : ''}
                    ${log.photo ? `<img src="${log.photo}" class="log-photo" alt="Прикрепленное фото">` : ''}
                `;
            list.appendChild(card);
        });
    } catch (error) {
        list.innerHTML = `<div class="empty-state" style="color: #ef4444;">Ошибка подключения к бэкенду. Убедись, что сервер запущен.</div>`;
        console.error("Ошибка:", error);
    }
}

// Запускаем загрузку
loadLogs();