// =========================
// BASE
// =========================
const API_BASE = "http://localhost:8080/api";


// =========================
// HELPER (ОБЯЗАТЕЛЬНО)
// =========================
async function request(url, options = {}) {
    try {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        });

        if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
        }

        const text = await res.text();

        return text ? JSON.parse(text) : null;

    } catch (err) {
        console.error("API REQUEST ERROR:", err);
        return null;
    }
}


// =========================
// AUTH
// =========================
async function loginUser(data) {
    return request(`${API_BASE}/login`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

async function registerUser(data) {
    return request(`${API_BASE}/register`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

async function deleteUser(email) {
    return request(`${API_BASE}/user/delete?email=${encodeURIComponent(email)}`, {
        method: "DELETE"
    });
}


// =========================
// MOODS (CHECK-IN + JOURNAL + CALENDAR + INSIGHTS)
// =========================
async function createMood(data) {
    return request(`${API_BASE}/moods`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

async function getAllMoods() {
    return request(`${API_BASE}/moods`);
}

async function getMoods() {
    return getAllMoods(); // alias для journal.js (чтобы не ломать старый код)
}

async function getMoodById(id) {
    return request(`${API_BASE}/moods/get?id=${id}`);
}

async function updateMood(data) {
    return request(`${API_BASE}/moods/update`, {
        method: "PUT",
        body: JSON.stringify(data)
    });
}

async function deleteMood(id) {
    return request(`${API_BASE}/moods/delete?id=${id}`, {
        method: "DELETE"
    });
}

async function searchMoods(query) {
    return request(`${API_BASE}/moods/search?q=${encodeURIComponent(query)}`);
}

// =========================
// TAGS API
// =========================

// GET ALL TAGS
async function getTags() {
    const res = await fetch(`${API_BASE}/tags`);

    if (!res.ok) {
        console.error("GET TAGS ERROR:", res.status);
        return [];
    }

    return await res.json();
}


// CREATE TAG
async function createTag(data) {
    const res = await fetch(`${API_BASE}/tags`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        console.error("CREATE TAG ERROR:", res.status);
        return null;
    }

    return await res.json();
}


// UPDATE TAG
async function updateTag(data) {
    const res = await fetch(`${API_BASE}/tags/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        console.error("UPDATE TAG ERROR:", res.status);
        return null;
    }

    return await res.json();
}


// DELETE TAG
async function deleteTag(id) {
    const res = await fetch(`${API_BASE}/tags/delete?id=${id}`, {
        method: "DELETE"
    });

    if (!res.ok) {
        console.error("DELETE TAG ERROR:", res.status);
        return null;
    }

    return await res.text();
}


// SEARCH TAGS
async function searchTagsApi(query) {
    const res = await fetch(`${API_BASE}/tags/search?q=${encodeURIComponent(query)}`);

    if (!res.ok) {
        console.error("SEARCH TAGS ERROR:", res.status);
        return [];
    }

    return await res.json();
}

// =========================
// ANALYTICS
// =========================
async function getStats() {
    return request(`${API_BASE}/stats`);
}

async function getTopTags() {
    return request(`${API_BASE}/tags/top`);
}

async function getTeamStats() {
    return request(`${API_BASE}/team/aggregate`);
}


// =========================
// SUPPORT
// =========================
async function getSupportContent() {
    return request(`${API_BASE}/support`);
}


// =========================
// REMINDERS
// =========================
async function setReminder(data) {
    return request(`${API_BASE}/user/reminders`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}


// =========================
// EXPORT
// =========================
function exportCSV() {
    window.open(`${API_BASE}/export/csv`);
}

function exportPDF() {
    window.open(`${API_BASE}/export/pdf`);
}


// =========================
// SYSTEM
// =========================
async function pingServer() {
    return request(`${API_BASE}/ping`);
}