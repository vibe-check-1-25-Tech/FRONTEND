// ПОЛНОСТЬЮ ИСПРАВЛЕННЫЙ СКРИПТ ДЛЯ КОМАНД
(function () {
    "use strict";

    let teams = [];
    let currentTeam = null;
    let moodChart = null;
    let selectedMood = 3;
    let selectedTags = [];
    let memberToDeleteId = null;
    let currentPrivateChat = null;
    let privateChats = {};

    const CURRENT_USER = "user_" + Math.random().toString(36).substr(2, 8);
    const CURRENT_NAME = "Я";

    function showToast(msg) {
        const t = document.getElementById('toast');
        if (!t) return;

        t.textContent = msg;
        t.classList.add('show');

        setTimeout(() => {
            t.classList.remove('show');
        }, 2500);
    }

    function save() {
        localStorage.setItem('vibe_team_premium', JSON.stringify(teams));
        localStorage.setItem('vibe_private_chats', JSON.stringify(privateChats));
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>]/g, function (m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function load() {
        const stored = localStorage.getItem('vibe_team_premium');

        if (stored) {
            teams = JSON.parse(stored);
        } else {
            teams = [{
                id: Date.now(),
                name: "✨ Креативная команда",
                membersList: [
                    { id: 101, name: "Анна", avatar: "А", role: "Lead" },
                    { id: 102, name: "Олег", avatar: "О", role: "Дизайнер" }
                ],
                moodRecords: [],
                chat: [
                    {
                        userId: "Анна",
                        authorName: "Анна",
                        text: "Всем привет! 👋",
                        time: new Date().toLocaleTimeString()
                    }
                ],
                tagsStats: {},
                customTags: [
                    "Дедлайны",
                    "Баги",
                    "Мотивация",
                    "Зарплата",
                    "Усталость",
                    "Поддержка",
                    "Релиз",
                    "Обучение"
                ]
            }];
        }

        const storedChats = localStorage.getItem('vibe_private_chats');

        if (storedChats) {
            privateChats = JSON.parse(storedChats);
        }

        teams.forEach(t => {
            if (!t.customTags) {
                t.customTags = [
                    "Дедлайны",
                    "Баги",
                    "Мотивация",
                    "Зарплата",
                    "Усталость",
                    "Поддержка",
                    "Релиз",
                    "Обучение"
                ];
            }

            if (!t.moodRecords) t.moodRecords = [];
            if (!t.chat) t.chat = [];
            if (!t.tagsStats) t.tagsStats = {};
            if (!t.membersList) t.membersList = [];
        });

        renderTeams();
    }

    function getTeamAvg(team) {
        if (!team.moodRecords.length) return "—";

        const sum = team.moodRecords.reduce((a, b) => a + b.moodValue, 0);

        return (sum / team.moodRecords.length).toFixed(1);
    }

    function renderTeams() {
        const cont = document.getElementById('teamsList');

        if (!cont) return;

        cont.innerHTML = teams.map(t => `
            <div class="team-card" data-id="${t.id}">
                <div>
                    <h3>${escapeHtml(t.name)}</h3>
                    <div class="team-stats">
                        👥 ${t.membersList.length} • ⭐ ${getTeamAvg(t)}
                    </div>
                </div>
                <div class="team-rating">
                    ⭐ ${getTeamAvg(t)}
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', () => {
                openTeam(parseInt(card.dataset.id));
            });
        });
    }

    function openTeam(id) {
        currentTeam = teams.find(t => t.id === id);

        if (!currentTeam) return;

        document.getElementById('mainPage').style.display = 'none';
        document.getElementById('teamDetailPage').style.display = 'block';
        document.getElementById('addTeamBtn').style.display = 'none';

        document.getElementById('detailTeamName').innerHTML =
            `<i class="fas fa-users"></i> ${escapeHtml(currentTeam.name)}`;

        document.getElementById('detailMemberCount').innerText =
            currentTeam.membersList.length;

        document.getElementById('detailRating').innerText =
            getTeamAvg(currentTeam);

        document.getElementById('detailVotes').innerText =
            currentTeam.moodRecords.length;

        selectedMood = 3;
        selectedTags = [];

        renderTagsGrid();
        renderMembers();
        renderChat();
        renderAnalytics();

        document.querySelectorAll('#teamMoodGrid .team-mood-option')
            .forEach(opt => {
                opt.classList.remove('active');

                if (parseInt(opt.dataset.mood) === 3) {
                    opt.classList.add('active');
                }
            });
    }

    function renderTagsGrid() {
        const container = document.getElementById('teamTagsGrid');

        if (!container || !currentTeam) return;

        container.innerHTML = (currentTeam.customTags || []).map(tag => `
            <button class="team-mood-tag" data-tag="${escapeHtml(tag)}">
                ${escapeHtml(tag)}
                <span class="tag-delete-btn" data-tag="${escapeHtml(tag)}">
                    <i class="fas fa-times-circle"></i>
                </span>
            </button>
        `).join('');

        document.querySelectorAll('.team-mood-tag').forEach(btn => {

            btn.addEventListener('click', (e) => {

                if (
                    e.target.classList.contains('tag-delete-btn') ||
                    e.target.closest('.tag-delete-btn')
                ) {
                    return;
                }

                const tg = btn.dataset.tag;

                if (selectedTags.includes(tg)) {
                    selectedTags = selectedTags.filter(t => t !== tg);
                } else {
                    selectedTags.push(tg);
                }

                btn.classList.toggle(
                    'active',
                    selectedTags.includes(tg)
                );
            });

            const del = btn.querySelector('.tag-delete-btn');

            if (del) {
                del.addEventListener('click', (e) => {

                    e.stopPropagation();

                    const tg = del.dataset.tag;

                    currentTeam.customTags =
                        currentTeam.customTags.filter(t => t !== tg);

                    selectedTags =
                        selectedTags.filter(t => t !== tg);

                    save();
                    renderTagsGrid();

                    showToast(`Тег "${tg}" удалён`);
                });
            }
        });
    }

    function renderMembers() {
        const cont = document.getElementById('membersList');

        if (!cont || !currentTeam) return;

        cont.innerHTML = currentTeam.membersList.map(m => `
            <div class="member-item">
                <div class="member-info">
                    <div class="member-avatar">
                        ${escapeHtml(m.avatar)}
                    </div>

                    <div>
                        <strong>${escapeHtml(m.name)}</strong>

                        <div style="font-size:12px;">
                            ${escapeHtml(m.role)}
                        </div>
                    </div>
                </div>

                <div class="member-actions">
                    <button
                        class="member-chat-btn"
                        data-id="${m.id}"
                        data-name="${escapeHtml(m.name)}"
                    >
                        <i class="fas fa-comment"></i>
                    </button>

                    <button
                        class="member-delete-btn"
                        data-id="${m.id}"
                    >
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.member-chat-btn')
            .forEach(btn => {
                btn.addEventListener('click', () => {
                    openPrivateChat(
                        parseInt(btn.dataset.id),
                        btn.dataset.name
                    );
                });
            });

        document.querySelectorAll('.member-delete-btn')
            .forEach(btn => {
                btn.addEventListener('click', () => {
                    memberToDeleteId = parseInt(btn.dataset.id);

                    document.getElementById('confirmDeleteMemberModal')
                        .classList.add('show');
                });
            });
    }

    function renderChat() {
        const cont = document.getElementById('chatMessages');

        if (!cont || !currentTeam) return;

        cont.innerHTML = currentTeam.chat.map(msg => `
            <div class="chat-message ${msg.userId === CURRENT_USER ? 'me' : ''}">
                <div class="user">
                    ${msg.userId === CURRENT_USER
            ? CURRENT_NAME
            : escapeHtml(msg.authorName)}
                </div>

                <div class="text">
                    ${escapeHtml(msg.text)}
                </div>

                <div style="font-size:10px; margin-top:4px; color:#8e84a3;">
                    ${msg.time}
                </div>
            </div>
        `).join('');

        cont.scrollTop = cont.scrollHeight;
    }

    function sendChat() {
        const inp = document.getElementById('chatInput');

        if (!inp || !currentTeam) return;

        const txt = inp.value.trim();

        if (!txt) return;

        currentTeam.chat.push({
            userId: CURRENT_USER,
            authorName: CURRENT_NAME,
            text: txt,
            time: new Date().toLocaleTimeString()
        });

        save();
        renderChat();

        inp.value = '';
    }

    function renderAnalytics() {
        const canvas = document.getElementById('teamChart');

        if (!canvas || !currentTeam) return;

        const ctx = canvas.getContext('2d');

        if (moodChart) {
            moodChart.destroy();
        }

        const days = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();

            d.setDate(d.getDate() - i);

            days.push(d.toISOString().slice(0, 10));
        }

        const daily = {};

        currentTeam.moodRecords.forEach(r => {
            const day = r.date.slice(0, 10);

            if (!daily[day]) {
                daily[day] = [];
            }

            daily[day].push(r.moodValue);
        });

        const labels = [];
        const values = [];

        days.forEach(day => {

            labels.push(day.slice(5));

            if (daily[day]) {
                values.push(
                    daily[day].reduce((a, b) => a + b, 0) /
                    daily[day].length
                );
            } else {
                values.push(null);
            }
        });

        const fl = labels.filter((_, i) => values[i] !== null);
        const fv = values.filter(v => v !== null);

        moodChart = new Chart(ctx, {
            type: 'line',

            data: {
                labels: fl,

                datasets: [{
                    label: 'Среднее настроение',
                    data: fv,
                    borderColor: '#3b1c5a',
                    tension: 0.2,
                    fill: true,
                    backgroundColor: 'rgba(59,28,90,0.05)'
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        const tagCnt = {};

        currentTeam.moodRecords.forEach(r => {

            if (r.tags) {
                r.tags.forEach(t => {
                    tagCnt[t] = (tagCnt[t] || 0) + 1;
                });
            }
        });

        const statsDiv = document.getElementById('tagsStatsList');

        if (!statsDiv) return;

        if (Object.keys(tagCnt).length === 0) {

            statsDiv.innerHTML =
                '<div style="padding:20px; text-align:center;">Нет данных по тегам</div>';

        } else {

            statsDiv.innerHTML = Object.entries(tagCnt).map(([t, c]) => `
                <div class="tag-stat-item">
                    <div class="tag-stat-name">
                        ${escapeHtml(t)}
                    </div>

                    <div class="tag-stat-bar">
                        <div
                            class="tag-stat-fill"
                            style="width:${Math.min(100, c * 12)}%"
                        ></div>
                    </div>

                    <div class="tag-stat-count">
                        ${c}
                    </div>
                </div>
            `).join('');
        }
    }

    function saveMood() {
        if (!currentTeam) return;

        const today = new Date().toISOString().slice(0, 10);

        const alreadyVoted = currentTeam.moodRecords.some(r =>
            r.userId === CURRENT_USER &&
            r.date.startsWith(today)
        );

        if (alreadyVoted) {
            showToast("Сегодня вы уже голосовали в этой команде");
            return;
        }

        currentTeam.moodRecords.push({
            userId: CURRENT_USER,
            date: new Date().toISOString(),
            moodValue: selectedMood,
            tags: [...selectedTags]
        });

        selectedTags.forEach(t => {
            currentTeam.tagsStats[t] =
                (currentTeam.tagsStats[t] || 0) + 1;
        });

        save();

        document.getElementById('detailRating').innerText =
            getTeamAvg(currentTeam);

        document.getElementById('detailVotes').innerText =
            currentTeam.moodRecords.length;

        renderAnalytics();
        renderTeams();

        showToast(`✅ Голос принят! Настроение ${selectedMood}/5`);

        selectedTags = [];

        renderTagsGrid();
    }

    function addMember() {
        const input = document.getElementById('newMemberName');

        if (!input || !currentTeam) return;

        const name = input.value.trim();

        if (!name) return;

        currentTeam.membersList.push({
            id: Date.now(),
            name,
            avatar: name[0].toUpperCase(),
            role: "Участник"
        });

        save();

        renderMembers();

        document.getElementById('detailMemberCount').innerText =
            currentTeam.membersList.length;

        showToast(`${name} добавлен`);

        document.getElementById('addMemberModal')
            .classList.remove('show');

        input.value = '';
    }

    function deleteMember() {
        if (currentTeam && memberToDeleteId) {

            currentTeam.membersList =
                currentTeam.membersList.filter(
                    m => m.id !== memberToDeleteId
                );

            save();
            renderMembers();

            document.getElementById('detailMemberCount').innerText =
                currentTeam.membersList.length;

            showToast("Участник удалён");
        }

        document.getElementById('confirmDeleteMemberModal')
            .classList.remove('show');

        memberToDeleteId = null;
    }

    function createTeam() {
        const input = document.getElementById('newTeamName');

        if (!input) return;

        const name = input.value.trim();

        if (!name) return;

        const newTeam = {
            id: Date.now(),

            name,

            membersList: [{
                id: Date.now() + 1,
                name: "Я",
                avatar: "Я",
                role: "Lead"
            }],

            moodRecords: [],
            chat: [],
            tagsStats: {},

            customTags: [
                "Дедлайны",
                "Баги",
                "Мотивация",
                "Зарплата",
                "Усталость",
                "Поддержка",
                "Релиз",
                "Обучение"
            ]
        };

        teams.push(newTeam);

        save();
        renderTeams();

        document.getElementById('createTeamModal')
            .classList.remove('show');

        input.value = '';

        showToast(`Команда "${name}" создана`);
    }

    function deleteCurrentTeam() {
        if (currentTeam) {

            teams = teams.filter(t => t.id !== currentTeam.id);

            save();
            renderTeams();

            document.getElementById('teamDetailPage').style.display = 'none';
            document.getElementById('mainPage').style.display = 'block';
            document.getElementById('addTeamBtn').style.display = 'flex';

            currentTeam = null;

            showToast("Команда удалена");
        }

        document.getElementById('confirmDeleteModal')
            .classList.remove('show');
    }

    function goBack() {
        document.getElementById('teamDetailPage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'block';
        document.getElementById('addTeamBtn').style.display = 'flex';

        currentTeam = null;
    }

    function addCustomTag() {
        const input = document.getElementById('newTagName');

        if (!input || !currentTeam) return;

        const newTag = input.value.trim();

        if (!newTag) return;

        if (currentTeam.customTags.includes(newTag)) {
            showToast("Такой тег уже есть");
            return;
        }

        currentTeam.customTags.push(newTag);

        save();
        renderTagsGrid();

        document.getElementById('addTagModal')
            .classList.remove('show');

        input.value = '';

        showToast(`Тег "${newTag}" добавлен`);
    }

    function openPrivateChat(userId, userName) {
        if (!currentTeam) return;

        currentPrivateChat = {
            teamId: currentTeam.id,
            userId,
            userName
        };

        const chatKey = `${currentTeam.id}_${userId}`;

        if (!privateChats[chatKey]) {
            privateChats[chatKey] = [];
        }

        renderPrivateChat();

        document.getElementById('privateChatModal')
            .classList.add('show');
    }

    function renderPrivateChat() {
        if (!currentPrivateChat) return;

        const chatKey =
            `${currentPrivateChat.teamId}_${currentPrivateChat.userId}`;

        const messages = privateChats[chatKey] || [];

        const container =
            document.getElementById('privateChatMessages');

        if (!container) return;

        container.innerHTML = messages.map(msg => `
            <div class="private-message ${msg.sender === CURRENT_USER ? 'me' : 'other'}">
                <div class="bubble">
                    ${escapeHtml(msg.text)}

                    <div style="font-size:10px; opacity:0.6; margin-top:4px;">
                        ${msg.time}
                    </div>
                </div>
            </div>
        `).join('');

        container.scrollTop = container.scrollHeight;

        document.querySelector(
            '#privateChatModal .private-chat-header h3'
        ).innerHTML =
            `<i class="fas fa-user"></i> Чат с ${escapeHtml(currentPrivateChat.userName)}`;
    }

    function sendPrivateMessage() {
        if (!currentPrivateChat) return;

        const input =
            document.getElementById('privateChatInput');

        if (!input) return;

        const text = input.value.trim();

        if (!text) return;

        const chatKey =
            `${currentPrivateChat.teamId}_${currentPrivateChat.userId}`;

        if (!privateChats[chatKey]) {
            privateChats[chatKey] = [];
        }

        privateChats[chatKey].push({
            sender: CURRENT_USER,
            text,
            time: new Date().toLocaleTimeString()
        });

        save();

        renderPrivateChat();

        input.value = '';
    }

    function closePrivateChat() {
        document.getElementById('privateChatModal')
            .classList.remove('show');

        currentPrivateChat = null;
    }

    // EVENT LISTENERS

    document.getElementById('backToTeamsBtn')
        ?.addEventListener('click', goBack);

    document.getElementById('addTeamBtn')
        ?.addEventListener('click', () => {
            document.getElementById('createTeamModal')
                .classList.add('show');
        });

    document.getElementById('closeCreateModal')
        ?.addEventListener('click', () => {
            document.getElementById('createTeamModal')
                .classList.remove('show');
        });

    document.getElementById('confirmCreateBtn')
        ?.addEventListener('click', createTeam);

    document.getElementById('deleteTeamBtn')
        ?.addEventListener('click', () => {
            document.getElementById('confirmDeleteModal')
                .classList.add('show');
        });

    document.getElementById('confirmDeleteBtn')
        ?.addEventListener('click', deleteCurrentTeam);

    document.getElementById('cancelDeleteBtn')
        ?.addEventListener('click', () => {
            document.getElementById('confirmDeleteModal')
                .classList.remove('show');
        });

    document.getElementById('openAddMemberBtn')
        ?.addEventListener('click', () => {
            document.getElementById('addMemberModal')
                .classList.add('show');
        });

    document.getElementById('closeAddMemberModal')
        ?.addEventListener('click', () => {
            document.getElementById('addMemberModal')
                .classList.remove('show');
        });

    document.getElementById('confirmAddMemberBtn')
        ?.addEventListener('click', addMember);

    document.getElementById('sendChatBtn')
        ?.addEventListener('click', sendChat);

    document.getElementById('chatInput')
        ?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChat();
            }
        });

    document.getElementById('saveTeamMoodBtn')
        ?.addEventListener('click', saveMood);

    document.getElementById('confirmDeleteMemberBtn')
        ?.addEventListener('click', deleteMember);

    document.getElementById('cancelDeleteMemberBtn')
        ?.addEventListener('click', () => {
            document.getElementById('confirmDeleteMemberModal')
                .classList.remove('show');
        });

    document.getElementById('closePrivateChatBtn')
        ?.addEventListener('click', closePrivateChat);

    document.getElementById('sendPrivateChatBtn')
        ?.addEventListener('click', sendPrivateMessage);

    document.getElementById('privateChatInput')
        ?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendPrivateMessage();
            }
        });

    document.getElementById('openAddTagBtn')
        ?.addEventListener('click', () => {
            document.getElementById('addTagModal')
                .classList.add('show');
        });

    document.getElementById('closeTagModalBtn')
        ?.addEventListener('click', () => {
            document.getElementById('addTagModal')
                .classList.remove('show');
        });

    document.getElementById('confirmAddTagBtn')
        ?.addEventListener('click', addCustomTag);

    document.querySelectorAll('#teamMoodGrid .team-mood-option')
        .forEach(opt => {

            opt.addEventListener('click', function () {

                document.querySelectorAll('#teamMoodGrid .team-mood-option')
                    .forEach(o => o.classList.remove('active'));

                this.classList.add('active');

                selectedMood = parseInt(this.dataset.mood);
            });
        });

    document.querySelectorAll('.detail-tab')
        .forEach(btn => {

            btn.addEventListener('click', () => {

                document.querySelectorAll('.detail-tab')
                    .forEach(t => t.classList.remove('active'));

                btn.classList.add('active');

                document.querySelectorAll('.tab-content')
                    .forEach(tc => tc.classList.remove('active'));

                const tabId =
                    `tab${btn.dataset.tab.charAt(0).toUpperCase()}${btn.dataset.tab.slice(1)}`;

                document.getElementById(tabId)
                    .classList.add('active');
            });
        });

    // SIDEBAR

    document.getElementById('menuBtn').onclick = () => {
        document.getElementById('sidebar')
            .classList.add('open');

        document.getElementById('overlay')
            .classList.add('show');
    };

    document.getElementById('closeBtn').onclick = () => {
        document.getElementById('sidebar')
            .classList.remove('open');

        document.getElementById('overlay')
            .classList.remove('show');
    };

    document.getElementById('overlay').onclick = () => {
        document.getElementById('sidebar')
            .classList.remove('open');

        document.getElementById('overlay')
            .classList.remove('show');
    };

    load();

})();