// api.js
const API_URL = 'http://localhost:8080/api';


async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    } catch (error) {
        console.error('Ошибка связи с бэкендом:', error);
        alert("Бэкенд не отвечает. Проверь, запущен ли Go-сервер!");
        return null;
    }
}
// Функция для добавления нового тега
async function handleTagAdd() {
    const input = document.getElementById('tagInput');
    const tagName = input.value.trim();

    if (!tagName) {
        alert("Сначала введи название тега!");
        return;
    }

    // Отправляем данные на твой бэкенд (Go)
    try {
        const response = await fetch('/api/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: tagName })
        });

        if (response.ok) {
            input.value = '';
            location.reload();
        }
    } catch (error) {
        console.error("Ошибка при добавлении:", error);
    }
}

// Функция для удаления (вызывается из меню тега)
async function handleTagDelete(tagId) {
    if (!confirm("Удалить этот тег?")) return;

    try {
        const response = await fetch(`/api/tags/${tagId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            location.reload();
        }
    } catch (error) {
        console.error("Ошибка при удалении:", error);
    }
}

async function getData(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error('Ошибка сервера');
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return null;
    }
}
