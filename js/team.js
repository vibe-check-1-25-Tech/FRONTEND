/API НЕ ДОБАВ/
let selectedEmoji = "";
let chF, chB;
let activeName = "";
let isTeam = false;

const appData = {
    teams: {
        Frontend: { m: ["Алия", "Марк"], h: [] },
        Backend: { m: ["Айбек"], h: [] }
    },
    dms: {
        "Алия": [],
        "Марк": [],
        "Айбек": []
    }
};

function go(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-bar button').forEach(b => b.classList.remove('active-nav'));
    document.getElementById(id).classList.add('active');
    render();
}

function render() {
    document.getElementById('teamList').innerHTML =
        Object.keys(appData.teams)
            .map(t =>
                `<div class="list-item" onclick="openChat('${t}', true)">
                    <b>${t} Team</b><span>➤</span>
                </div>`
            ).join("");

    document.getElementById('dmList').innerHTML =
        Object.keys(appData.dms)
            .map(u =>
                `<div class="list-item" onclick="openChat('${u}', false)">
                    <span>👤 ${u}</span><span>➤</span>
                </div>`
            ).join("");
}

function filterList(id, val) {
    const items = document.getElementById(id).getElementsByClassName('list-item');
    for (let i of items) {
        i.style.display = i.innerText.toLowerCase().includes(val.toLowerCase())
            ? 'flex'
            : 'none';
    }
}

function filterCharts(val) {
    document.querySelectorAll('.chart-card').forEach(c => {
        c.style.display = c.dataset.name.includes(val.toLowerCase())
            ? 'block'
            : 'none';
    });
}

function openChat(name, team) {
    activeName = name;
    isTeam = team;

    document.getElementById('chatTitle').innerText = name;
    document.getElementById('chatModal').style.display = 'flex';
    document.getElementById('membersOverlay').style.display = 'none';

    renderMsgs();
}

function toggleMembers() {
    if (!isTeam) return;

    const overlay = document.getElementById('membersOverlay');
    overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';

    document.getElementById('membersContent').innerHTML =
        appData.teams[activeName].m
            .map(m =>
                `<div class="member-row">
                    <span>👤 ${m}</span>
                    <button onclick="openChat('${m}', false)">Написать</button>
                </div>`
            ).join("");
}

function renderMsgs() {
    const box = document.getElementById('chatBox');
    const h = isTeam
        ? appData.teams[activeName].h
        : appData.dms[activeName];

    box.innerHTML = h
        .map(m =>
            `<div class="msg ${m.u === 'Вы' ? 'me' : ''}">
                <b>${m.u}</b><br>${m.t}
            </div>`
        ).join("");

    box.scrollTop = box.scrollHeight;
}

function sendMsg() {
    const inp = document.getElementById('chatInp');
    if (!inp.value) return;

    const msg = { u: 'Вы', t: inp.value };

    if (isTeam) {
        appData.teams[activeName].h.push(msg);
    } else {
        appData.dms[activeName].push(msg);
    }

    inp.value = "";
    renderMsgs();
}

function pickM(e) {
    selectedEmoji = e;
    document.getElementById('moodPick').innerText = "Выбрано: " + e;
}

function saveStats() {
    if (!selectedEmoji) return alert("Выбери смайл!");

    const score = { '😄': 5, '🙂': 4, '😐': 3, '😕': 2, '😡': 1 }[selectedEmoji];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    chF.data.labels.push(time);
    chF.data.datasets[0].data.push(score);
    chF.update();

    alert("Сохранено!");
    go('analytics');
}

function addNewTeam() {
    const v = document.getElementById('newTeamInput').value;

    if (v) {
        appData.teams[v] = { m: ['Вы'], h: [] };
        render();
        document.getElementById('createModal').style.display = 'none';
    }
}

window.onload = () => {
    render();

    const cfg = (label, color) => ({
        type: 'line',
        data: {
            labels: ['09:00', '12:00'],
            datasets: [{
                label,
                data: [4, 4.5],
                borderColor: color,
                fill: true,
                backgroundColor: color + '22',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    chF = new Chart(document.getElementById('chartF'), cfg('Frontend', '#6366f1'));
    chB = new Chart(document.getElementById('chartB'), cfg('Backend', '#22c55e'));
};