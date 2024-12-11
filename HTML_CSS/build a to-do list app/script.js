// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');

    // Add To-Do Item
    addBtn.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        if (todoText !== '') {
            addTodoItem(todoText);
            todoInput.value = ''; // Clear input
        } else {
            alert('Please enter a task!');
        }
    });

    // Function to Add To-Do Item
    function addTodoItem(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task}</span>
            <span class="delete-btn">&times;</span>
        `;
        todoList.appendChild(li);

        // Add delete functionality
        li.querySelector('.delete-btn').addEventListener('click', () => {
            todoList.removeChild(li);
        });
    }
});
