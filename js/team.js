// =========================
// TEAM PAGE - ФИНАЛЬНАЯ ВЕРСИЯ
// =========================

// ========== ДАННЫЕ ==========
let teams = [
    { id: 1, name: 'Frontend Team', members: ['Анна', 'Дмитрий', 'Максим'], avgMood: 4.2, moodEntries: [] },
    { id: 2, name: 'Backend Team', members: ['Елена', 'Павел', 'Мария'], avgMood: 3.8, moodEntries: [] },
    { id: 3, name: 'Design Team', members: ['Ольга', 'Кирилл'], avgMood: 4.5, moodEntries: [] }
];

let users = [
    { id: 1, name: 'Анна', avatar: 'А', online: true, role: 'Team Lead', teamId: 1 },
    { id: 2, name: 'Дмитрий', avatar: 'Д', online: true, role: 'Developer', teamId: 1 },
    { id: 3, name: 'Максим', avatar: 'М', online: false, role: 'Developer', teamId: 1 },
    { id: 4, name: 'Елена', avatar: 'Е', online: true, role: 'Team Lead', teamId: 2 },
    { id: 5, name: 'Павел', avatar: 'П', online: false, role: 'Developer', teamId: 2 },
    { id: 6, name: 'Мария', avatar: 'М', online: true, role: 'QA', teamId: 2 },
    { id: 7, name: 'Ольга', avatar: 'О', online: true, role: 'Designer', teamId: 3 },
    { id: 8, name: 'Кирилл', avatar: 'К', online: false, role: 'Designer', teamId: 3 }
];

let teamMessages = {
    1: [{ text: 'Добро пожаловать в Frontend Team!', sender: 'system', time: '10:00' }],
    2: [{ text: 'Добро пожаловать в Backend Team!', sender: 'system', time: '10:00' }],
    3: [{ text: 'Добро пожаловать в Design Team!', sender: 'system', time: '10:00' }]
};

let privateMessages = {};
let teamMoodStats = JSON.parse(localStorage.getItem('teamMoodStats')) || {};
let globalMoodEntries = JSON.parse(localStorage.getItem('globalMoodEntries')) || [];
let currentTeam = null;
let currentPrivateUser = null;
let selectedMood = 3;
let moodChart = null;
let tempMembers = [];

const moodEmojis = { 1: '😢', 2: '😐', 3: '🙂', 4: '😊', 5: '😁' };
const moodNames = { 1: 'Плохо', 2: 'Не очень', 3: 'Нормально', 4: 'Хорошо', 5: 'Отлично' };

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function getCurrentTime() {
    return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function showToast(message) {
    let toast = document.querySelector('.toast');
    if (toast) toast.remove();
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// ========== ЕДИНОЕ АНОНИМНОЕ НАСТРОЕНИЕ ==========
function updateAllTeamsMoodStats(moodValue) {
    teams.forEach(team => {
        if (!teamMoodStats[team.id]) {
            teamMoodStats[team.id] = { totalMoods: [] };
        }
        teamMoodStats[team.id].totalMoods.push(moodValue);
        if (teamMoodStats[team.id].totalMoods.length > 100) {
            teamMoodStats[team.id].totalMoods.shift();
        }
        const sum = teamMoodStats[team.id].totalMoods.reduce((a, b) => a + b, 0);
        const avg = sum / teamMoodStats[team.id].totalMoods.length;
        team.avgMood = Math.round(avg * 10) / 10;
    });
    localStorage.setItem('teamMoodStats', JSON.stringify(teamMoodStats));
}

function saveGlobalMood() {
    const note = document.getElementById('moodNote').value;
    const moodValue = selectedMood;

    const entry = {
        id: Date.now(),
        mood: moodValue,
        emoji: moodEmojis[moodValue],
        moodName: moodNames[moodValue],
        note: note,
        date: new Date().toLocaleDateString('ru-RU'),
        time: getCurrentTime()
    };

    globalMoodEntries.unshift(entry);
    if (globalMoodEntries.length > 50) globalMoodEntries.pop();
    localStorage.setItem('globalMoodEntries', JSON.stringify(globalMoodEntries));

    updateAllTeamsMoodStats(moodValue);

    document.getElementById('moodNote').value = '';
    renderTeams();
    if (currentTeam) {
        document.getElementById('detailAvgMood').innerHTML = `<i class="fas fa-chart-line"></i> Рейтинг: ${currentTeam.avgMood}/5`;
        renderTeamAnalytics();
    }
    showToast(`😊 Настроение сохранено! ${moodEmojis[moodValue]} ${moodNames[moodValue]}`);
}

// ========== ГЛАВНАЯ СТРАНИЦА ==========
function renderTeams() {
    const searchTerm = document.getElementById('teamSearch')?.value.toLowerCase() || '';
    const filtered = teams.filter(t => t.name.toLowerCase().includes(searchTerm));
    const container = document.getElementById('teamsList');
    if (!container) return;

    container.innerHTML = filtered.map(team => `
      <div class="team-card">
        <div class="team-info" onclick="openTeamDetail(${team.id})">
          <h3><i class="fas fa-users"></i> ${team.name}</h3>
          <div class="team-stats">
            <span><i class="fas fa-user"></i> ${team.members.length} участников</span>
          </div>
        </div>
        <div style="display: flex; gap: 4px; align-items: center;">
          <button class="team-add-member-btn" onclick="event.stopPropagation(); showAddMemberModal(${team.id})" title="Добавить участника">
            <i class="fas fa-user-plus"></i>
          </button>
          <button class="team-delete-btn" onclick="event.stopPropagation(); showDeleteTeamConfirm(${team.id}, '${escapeHtml(team.name)}')" title="Удалить команду">
            <i class="fas fa-trash-alt"></i>
          </button>
          <div class="team-rating">⭐ ${team.avgMood}</div>
        </div>
      </div>
    `).join('');
}

// ========== ДОБАВЛЕНИЕ УЧАСТНИКА ==========
function addMemberToTeam(teamId, memberName) {
    const team = teams.find(t => t.id === teamId);
    if (!team) return false;

    if (team.members.includes(memberName)) {
        showToast(`⚠️ ${memberName} уже состоит в команде`);
        return false;
    }

    team.members.push(memberName);

    const newUser = {
        id: Date.now(),
        name: memberName,
        avatar: memberName.charAt(0).toUpperCase(),
        online: true,
        role: 'Участник',
        teamId: teamId
    };
    users.push(newUser);

    if (!privateMessages[newUser.id]) privateMessages[newUser.id] = [];

    if (!teamMessages[teamId]) teamMessages[teamId] = [];
    teamMessages[teamId].push({
        text: `👋 ${memberName} присоединился к команде!`,
        sender: 'system',
        time: getCurrentTime()
    });

    renderTeams();
    if (currentTeam && currentTeam.id === teamId) {
        renderMembers();
        renderTeamChat();
    }

    showToast(`✅ ${memberName} добавлен в команду ${team.name}`);
    return true;
}

function showAddMemberModal(teamId) {
    const memberName = prompt('Введите имя нового участника:');
    if (memberName && memberName.trim()) {
        addMemberToTeam(teamId, memberName.trim());
    }
}

function addMemberFromDetail() {
    const input = document.getElementById('newMemberName');
    const name = input.value.trim();
    if (!name) {
        showToast('Введите имя участника');
        return;
    }
    if (addMemberToTeam(currentTeam.id, name)) {
        input.value = '';
    }
}

// ========== УДАЛЕНИЕ КОМАНДЫ ==========
function showDeleteTeamConfirm(teamId, teamName) {
    const modal = document.getElementById('confirmDeleteModal');
    const messageSpan = document.getElementById('deleteTeamName');
    if (messageSpan) messageSpan.textContent = teamName;
    if (modal) {
        modal.classList.add('show');
        modal.setAttribute('data-team-id', teamId);
    }
}

function closeDeleteConfirmModal() {
    const modal = document.getElementById('confirmDeleteModal');
    if (modal) modal.classList.remove('show');
}

function confirmDeleteTeam() {
    const modal = document.getElementById('confirmDeleteModal');
    const teamId = parseInt(modal?.getAttribute('data-team-id'));
    if (!teamId) return;

    const teamIndex = teams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) return;

    const teamName = teams[teamIndex].name;

    teams.splice(teamIndex, 1);
    users = users.filter(u => u.teamId !== teamId);
    delete teamMessages[teamId];
    delete teamMoodStats[teamId];

    localStorage.setItem('teamMoodStats', JSON.stringify(teamMoodStats));

    renderTeams();

    if (currentTeam && currentTeam.id === teamId) {
        backToTeams();
    }

    showToast(`🗑️ Команда "${teamName}" удалена`);
    closeDeleteConfirmModal();
}

// ========== ДЕТАЛИ КОМАНДЫ ==========
window.openTeamDetail = function(teamId) {
    currentTeam = teams.find(t => t.id === teamId);
    if (!currentTeam) return;

    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('teamDetailPage').style.display = 'block';
    document.getElementById('addTeamBtn').style.display = 'none';

    document.getElementById('detailTeamName').innerHTML = `<i class="fas fa-users"></i> ${currentTeam.name}`;
    document.getElementById('detailMemberCount').innerHTML = `<i class="fas fa-user"></i> ${currentTeam.members.length} участников`;
    document.getElementById('detailAvgMood').innerHTML = `<i class="fas fa-chart-line"></i> Рейтинг: ${currentTeam.avgMood}/5`;

    renderMembers();
    renderTeamChat();
    renderTeamAnalytics();
    initMoodSelector();
}

function backToTeams() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('teamDetailPage').style.display = 'none';
    document.getElementById('addTeamBtn').style.display = 'block';
    currentTeam = null;
    renderTeams();
}

function renderMembers() {
    const teamUsers = users.filter(u => u.teamId === currentTeam.id);
    const container = document.getElementById('membersList');
    if (!container) return;

    container.innerHTML = `
      <div class="add-member-section">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span><i class="fas fa-user-plus"></i> <strong>Добавить участника</strong></span>
        </div>
        <div class="add-member-form">
          <input type="text" id="newMemberName" placeholder="Имя участника">
          <button onclick="addMemberFromDetail()">Добавить</button>
        </div>
      </div>
    `;

    container.innerHTML += teamUsers.map(user => `
      <div class="member-item">
        <div class="member-avatar">
          ${user.avatar}
          <div class="online-status ${user.online ? 'online' : 'offline'}"></div>
        </div>
        <div class="member-info">
          <div class="member-name">${user.name}</div>
          <div class="member-role">${user.role}</div>
        </div>
        <button class="member-chat-btn" onclick="openPrivateChat(${user.id})">
          <i class="fas fa-comment"></i> Написать
        </button>
      </div>
    `).join('');
}

// ========== НАСТРОЕНИЕ ==========
function initMoodSelector() {
    const moodOptions = document.querySelectorAll('#tabMood .mood-option');
    moodOptions.forEach(option => {
        option.onclick = function() {
            moodOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            selectedMood = parseInt(this.dataset.mood);
        };
    });
}

// ========== ЧАТ ==========
function renderTeamChat() {
    const messages = teamMessages[currentTeam.id] || [];
    const container = document.getElementById('teamChatMessages');
    if (!container) return;

    container.innerHTML = messages.map(msg => `
      <div class="chat-message ${msg.sender === 'me' ? 'sent' : 'received'}">
        ${msg.text}
        <div style="font-size:10px; opacity:0.6; margin-top:4px;">${msg.time}</div>
      </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
}

function sendTeamMessage() {
    const input = document.getElementById('teamChatInput');
    const text = input.value.trim();
    if (!text || !currentTeam) return;

    if (!teamMessages[currentTeam.id]) teamMessages[currentTeam.id] = [];
    teamMessages[currentTeam.id].push({
        text: text,
        sender: 'me',
        time: getCurrentTime()
    });

    input.value = '';
    renderTeamChat();
}

// ========== ЛИЧНЫЙ ЧАТ ==========
window.openPrivateChat = function(userId) {
    currentPrivateUser = users.find(u => u.id === userId);
    if (!currentPrivateUser) return;

    document.getElementById('privateChatTitle').innerHTML = `<i class="fas fa-user"></i> ${currentPrivateUser.name}`;
    renderPrivateMessages();
    document.getElementById('privateChatModal').classList.add('show');
}

function renderPrivateMessages() {
    const msgs = privateMessages[currentPrivateUser?.id] || [];
    const container = document.getElementById('privateChatMessages');
    if (!container) return;

    container.innerHTML = msgs.map(msg => `
      <div style="text-align: ${msg.sender === 'me' ? 'right' : 'left'}; margin-bottom: 8px;">
        <div style="display: inline-block; background: ${msg.sender === 'me' ? '#3b1c5a' : '#efe8f7'}; color: ${msg.sender === 'me' ? 'white' : '#3b1c5a'}; padding: 8px 12px; border-radius: 12px; max-width: 80%;">
          ${msg.text}
          <div style="font-size: 10px; opacity: 0.6;">${msg.time}</div>
        </div>
      </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
}

function sendPrivateMessage() {
    const input = document.getElementById('privateChatInput');
    const text = input.value.trim();
    if (!text || !currentPrivateUser) return;

    if (!privateMessages[currentPrivateUser.id]) privateMessages[currentPrivateUser.id] = [];
    privateMessages[currentPrivateUser.id].push({
        text: text,
        sender: 'me',
        time: getCurrentTime()
    });

    input.value = '';
    renderPrivateMessages();
    showToast(`Сообщение отправлено ${currentPrivateUser.name}`);
}

function closePrivateChat() {
    document.getElementById('privateChatModal').classList.remove('show');
    currentPrivateUser = null;
}

// ========== АНАЛИТИКА ==========
function renderTeamAnalytics() {
    const ctx = document.getElementById('teamMoodChart')?.getContext('2d');
    if (!ctx) return;

    const moodHistory = teamMoodStats[currentTeam.id]?.totalMoods || [];
    const last14Days = moodHistory.slice(-14);
    const labels = last14Days.map((_, i) => `${i+1} дн. назад`);
    const data = last14Days;

    if (moodChart) moodChart.destroy();
    moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length ? labels : ['Нет данных'],
            datasets: [{
                label: 'Среднее настроение команды',
                data: data.length ? data : [3],
                borderColor: '#3b1c5a',
                backgroundColor: 'rgba(59,28,90,0.1)',
                borderWidth: 3,
                pointRadius: 5,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { min: 1, max: 5, title: { display: true, text: 'Настроение (1-5)' } } }
        }
    });
}

// ========== СОЗДАНИЕ КОМАНДЫ ==========
function addTempMember() {
    const input = document.getElementById('memberNameInput');
    const name = input.value.trim();
    if (!name) {
        showToast('Введите имя участника');
        return;
    }
    if (tempMembers.includes(name)) {
        showToast('Этот участник уже добавлен');
        input.value = '';
        return;
    }
    tempMembers.push(name);
    renderMemberPreview();
    input.value = '';
    showToast(`➕ ${name} добавлен`);
}

function removeTempMember(index) {
    const removed = tempMembers[index];
    tempMembers.splice(index, 1);
    renderMemberPreview();
    showToast(`➖ ${removed} удален`);
}

function renderMemberPreview() {
    const container = document.getElementById('membersPreviewList');
    if (!container) return;

    if (tempMembers.length === 0) {
        container.innerHTML = '<div style="color: #8e84a3; text-align: center; padding: 12px;">Нет добавленных участников</div>';
        return;
    }

    container.innerHTML = tempMembers.map((member, idx) => `
      <div class="member-preview-item">
        <span><i class="fas fa-user"></i> ${escapeHtml(member)}</span>
        <button class="remove-member-btn" onclick="removeTempMember(${idx})">✕</button>
      </div>
    `).join('');
}

function openCreateTeamModal() {
    tempMembers = [];
    document.getElementById('newTeamName').value = '';
    document.getElementById('memberNameInput').value = '';
    renderMemberPreview();
    document.getElementById('createTeamModal').classList.add('show');
}

function closeCreateTeamModal() {
    document.getElementById('createTeamModal').classList.remove('show');
    tempMembers = [];
}

function createTeam() {
    const name = document.getElementById('newTeamName').value.trim();
    if (!name) {
        showToast('Введите название команды');
        return;
    }

    const newTeamId = Date.now();
    const newTeam = {
        id: newTeamId,
        name: name,
        members: [...tempMembers],
        avgMood: 3.5,
        moodEntries: []
    };

    teams.push(newTeam);

    tempMembers.forEach((memberName, idx) => {
        const newUser = {
            id: Date.now() + idx,
            name: memberName,
            avatar: memberName.charAt(0).toUpperCase(),
            online: true,
            role: 'Участник',
            teamId: newTeamId
        };
        users.push(newUser);
        if (!privateMessages[newUser.id]) privateMessages[newUser.id] = [];
    });

    teamMessages[newTeamId] = [{
        text: `✨ Добро пожаловать в команду ${name}!`,
        sender: 'system',
        time: getCurrentTime()
    }];

    renderTeams();
    closeCreateTeamModal();
    showToast(`✅ Команда "${name}" создана! Добавлено участников: ${tempMembers.length}`);
    tempMembers = [];
}

// ========== ВКЛАДКИ ==========
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`).classList.add('active');

    document.querySelectorAll('.team-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) btn.classList.add('active');
    });

    if (tabId === 'chat') renderTeamChat();
    if (tabId === 'analytics') renderTeamAnalytics();
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.getElementById('teamSearch')?.addEventListener('input', () => renderTeams());
document.getElementById('addTeamBtn')?.addEventListener('click', openCreateTeamModal);
document.getElementById('backToTeamsBtn')?.addEventListener('click', backToTeams);
document.getElementById('saveTeamMoodBtn')?.addEventListener('click', saveGlobalMood);
document.getElementById('sendTeamMsgBtn')?.addEventListener('click', sendTeamMessage);
document.getElementById('sendPrivateMsgBtn')?.addEventListener('click', sendPrivateMessage);
document.getElementById('closePrivateChatBtn')?.addEventListener('click', closePrivateChat);
document.getElementById('closeCreateTeamBtn')?.addEventListener('click', closeCreateTeamModal);
document.getElementById('createTeamBtn')?.addEventListener('click', createTeam);

document.getElementById('teamChatInput')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendTeamMessage(); });
document.getElementById('privateChatInput')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendPrivateMessage(); });

document.querySelectorAll('.team-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

document.getElementById('privateChatModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('privateChatModal')) closePrivateChat();
});
document.getElementById('createTeamModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('createTeamModal')) closeCreateTeamModal();
});
document.getElementById('confirmDeleteModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('confirmDeleteModal')) closeDeleteConfirmModal();
});

teams.forEach(team => {
    if (teamMoodStats[team.id]) {
        const sum = teamMoodStats[team.id].totalMoods?.reduce((a, b) => a + b, 0) || 0;
        const avg = sum / (teamMoodStats[team.id].totalMoods?.length || 1);
        team.avgMood = Math.round(avg * 10) / 10;
    }
});

renderTeams();