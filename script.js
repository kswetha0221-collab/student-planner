const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const subjectInput = document.getElementById('subjectInput');
const dueInput = document.getElementById('dueInput');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById('filterSelect');
const emptyMessage = document.getElementById('emptyMessage');

let tasks = JSON.parse(localStorage.getItem('studentPlannerTasks') || '[]');

document.getElementById('today').textContent = new Date().toLocaleDateString(undefined, {
  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
});

function saveTasks() {
  localStorage.setItem('studentPlannerTasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  const filter = filterSelect.value;
  const visibleTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  visibleTasks.forEach(task => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark ${task.name} as completed`);
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const info = document.createElement('div');
    info.className = 'task-info';
    const name = document.createElement('div');
    name.className = 'task-name';
    name.textContent = task.name;
    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.textContent = [task.subject || 'General', task.due ? `Due: ${task.due}` : 'No due date'].join(' • ');
    info.append(name, meta);

    const remove = document.createElement('button');
    remove.className = 'delete-btn';
    remove.type = 'button';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete ${task.name}`);
    remove.addEventListener('click', () => {
      tasks = tasks.filter(entry => entry.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, info, remove);
    taskList.append(item);
  });

  emptyMessage.hidden = visibleTasks.length > 0;
  document.getElementById('totalCount').textContent = tasks.length;
  document.getElementById('doneCount').textContent = tasks.filter(task => task.completed).length;
  document.getElementById('pendingCount').textContent = tasks.filter(task => !task.completed).length;
}

taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = taskInput.value.trim();
  if (!name) return;

  tasks.unshift({
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
    name,
    subject: subjectInput.value.trim(),
    due: dueInput.value,
    completed: false
  });

  saveTasks();
  taskForm.reset();
  taskInput.focus();
  renderTasks();
});

filterSelect.addEventListener('change', renderTasks);
renderTasks();
