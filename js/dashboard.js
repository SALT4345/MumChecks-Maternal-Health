document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    loadReminders();
    loadTips();
});

function checkAuth() {
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'index.html';
    }
}

function loadUserData() {
    const userId = localStorage.getItem('userId');
    fetch('api/user/profile.php?userId=' + userId, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const user = data.user;
            document.getElementById('userName').textContent = 'Welcome, ' + user.full_name + '!';
            const week = user.pregnancy_week;
            const daysRemaining = (40 - week) * 7;
            document.getElementById('weekInfo').textContent = 'Week ' + week + ' of 40';
            document.getElementById('daysRemaining').textContent = 'Days remaining: ' + daysRemaining;
            document.getElementById('progressFill').style.width = (week / 40 * 100) + '%';
            
            document.getElementById('profileName').value = user.full_name || '';
            document.getElementById('profileEmail').value = user.email || '';
            document.getElementById('profileWeek').value = week || '';
            document.getElementById('profileDueDate').value = user.due_date || '';
        }
    }).catch(err => console.error('Error:', err));
}

function showSection(e, sectionId) {
    e.preventDefault();
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    document.getElementById(sectionId).classList.add('active');
}

function loadReminders() {
    const userId = localStorage.getItem('userId');
    fetch('api/reminders/get.php?userId=' + userId, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success && data.reminders) {
            const list = document.getElementById('remindersList');
            list.innerHTML = '';
            data.reminders.forEach(r => {
                const div = document.createElement('div');
                div.className = 'reminder-item';
                div.innerHTML = `<div><h4>${r.title}</h4><p>${r.description}</p><p><small>Due: ${r.due_date}</small></p></div>
                <div><button onclick="completeReminder(${r.id})">✓</button><button onclick="deleteReminder(${r.id})">✕</button></div>`;
                list.appendChild(div);
            });
            document.getElementById('pendingTasks').textContent = data.reminders.length + ' tasks pending';
        }
    }).catch(err => console.error('Error:', err));
}

function loadTips() {
    fetch('api/tips/get.php', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success && data.tips) {
            const grid = document.getElementById('tipsGrid');
            grid.innerHTML = '';
            data.tips.forEach(tip => {
                const div = document.createElement('div');
                div.className = 'tip-card';
                div.innerHTML = `<h4>${tip.title}</h4><p>${tip.content}</p>`;
                grid.appendChild(div);
            });
        }
    }).catch(err => console.error('Error:', err));
}

document.getElementById('healthForm').addEventListener('submit', function(e) {
    e.preventDefault();
    fetch('api/health/log.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            weight: document.getElementById('weight').value,
            blood_pressure: document.getElementById('bloodPressure').value,
            temperature: document.getElementById('temperature').value,
            symptoms: document.getElementById('symptoms').value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Health data logged!');
            this.reset();
        }
    });
});

document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    fetch('api/user/update-profile.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            full_name: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            pregnancy_week: document.getElementById('profileWeek').value,
            due_date: document.getElementById('profileDueDate').value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) alert('Profile updated!');
    });
});

function completeReminder(id) {
    fetch('api/reminders/complete.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({ reminder_id: id })
    })
    .then(res => res.json())
    .then(data => { if (data.success) loadReminders(); });
}

function deleteReminder(id) {
    if (confirm('Delete this reminder?')) {
        fetch('api/reminders/delete.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authToken')
            },
            body: JSON.stringify({ reminder_id: id })
        })
        .then(res => res.json())
        .then(data => { if (data.success) loadReminders(); });
    }
}

function logout() {
    if (confirm('Logout?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}