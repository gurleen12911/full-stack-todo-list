document.addEventListener('DOMContentLoaded', function () {
    const todoList = document.getElementById('todoList');
    const todoInput = document.getElementById('todoInput');

    // Fetch todos from the server
    fetch('/api/todos')
        .then(response => response.json())
        .then(todos => renderTodos(todos))
        .catch(error => console.error('Error fetching todos:', error));

    function renderTodos(todos) {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.item;
            li.dataset.id = todo._id;
            li.addEventListener('click', () => deleteTodo(todo._id));
            todoList.appendChild(li);
        });
    }

    function addTodo() {
        console.log('addTodo function called'); // Debugging statement

        const newItem = todoInput.value.trim();
        if (newItem !== '') {
            fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item: newItem })
            })
                .then(response => response.json())
                .then(newTodo => {
                    todoInput.value = '';
                    renderTodos([newTodo]);
                })
                .catch(error => console.error('Error adding todo:', error));
        }
    }

    function deleteTodo(id) {
        console.log('deleteTodo function called'); // Debugging statement

        fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(() => fetch('/api/todos'))
            .then(response => response.json())
            .then(todos => renderTodos(todos))
            .catch(error => console.error('Error deleting todo:', error));
    }

    // Ensure the addTodo function is called when the button is clicked
    const addButton = document.querySelector('button');
    addButton.addEventListener('click', addTodo);
});
