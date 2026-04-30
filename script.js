let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderTasks() {
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    const taskList = document.getElementById('taskList');
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<p style="text-align:center;color:#999;">✨ کاری نیست! یه کار جدید اضافه کن</p>';
        document.getElementById('taskCount').innerText = '۰ کار';
        return;
    }

    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="task-check" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" data-id="${task.id}">✖</button>
        `;
        taskList.appendChild(li);
    });

    const pendingCount = tasks.filter(t => !t.completed).length;
    document.getElementById('taskCount').innerText = `${pendingCount} کار انجام نشده از ${tasks.length}`;
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (text === '') {
        alert('لطفاً یه کار بنویس!');
        return;
    }
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    input.value = '';
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

document.getElementById('taskList').addEventListener('click', (e) => {
    const id = parseInt(e.target.dataset.id);
    if (e.target.classList.contains('delete-btn')) {
        deleteTask(id);
    } else if (e.target.classList.contains('task-check')) {
        toggleTask(id);
    }
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

renderTasks();
