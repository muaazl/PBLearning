document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const taskCount = document.getElementById('task-count');
    const filters = document.querySelectorAll('.filter');
    const clearCompletedBtn = document.getElementById('clear-completed');

    let todos = []; // Array to hold the tasks
    let filter = 'all'; // Current filter (all, active, completed)
    let nextId = 1; // Initialize the ID counter for sequential IDs

    // Fetch tasks from the server
    function loadTodos() {
        fetch('todos.php')
            .then(response => response.json())
            .then(data => {
                todos = data;
                // Set nextId to one higher than the highest existing ID
                nextId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
                renderTodos();
            });
    }

    // Save tasks to the server
    function saveTodos() {
        fetch('todos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todos),
        });
    }

    // Render tasks based on filter
    function renderTodos() {
        todoList.innerHTML = '';
        const filteredTodos = todos.filter(todo =>
            filter === 'all' ? true : filter === 'active' ? !todo.completed : todo.completed
        );
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                <span>${todo.text}</span>
                <button class="delete" data-id="${todo.id}">x</button>
            `;
            todoList.appendChild(li);
        });
        taskCount.textContent = `${todos.filter(todo => !todo.completed).length} items left`;
    }

    // Add a new task
    todoInput.addEventListener('keypress', e => {
        if (e.key === 'Enter' && todoInput.value.trim()) {
            todos.push({ id: nextId++, text: todoInput.value.trim(), completed: false });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    });

    // Handle checkbox and delete button clicks
    todoList.addEventListener('click', e => {
        if (e.target.tagName === 'INPUT') {
            const id = parseInt(e.target.dataset.id, 10);
            const todo = todos.find(todo => todo.id === id);
            if (todo) {
                todo.completed = e.target.checked;
            }
        } else if (e.target.classList.contains('delete')) {
            const id = parseInt(e.target.dataset.id, 10);
            todos = todos.filter(todo => todo.id !== id);
        }
        saveTodos();
        renderTodos();
    });

    // Filter tasks
    filters.forEach(filterBtn => {
        filterBtn.addEventListener('click', () => {
            filters.forEach(btn => btn.classList.remove('active'));
            filterBtn.classList.add('active');
            filter = filterBtn.id.replace('filter-', '');
            renderTodos();
        });
    });

    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    });

    // Load initial tasks
    loadTodos();
});
