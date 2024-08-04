document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Function to save tasks to localStorage
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(li => ({
            text: li.querySelector('.task-text').textContent,
            completed: li.querySelector('.task-text').classList.contains('completed')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => addTaskToList(task.text, task.completed));
    }

    // Function to add a task to the list
    function addTaskToList(text, completed = false) {
        const listItem = document.createElement('li');
        
        const taskSpan = document.createElement('span');
        taskSpan.textContent = text;
        taskSpan.classList.add('task-text');
        if (completed) taskSpan.classList.add('completed');
        
        const cancelButton = document.createElement('img');
        cancelButton.src = 'cancel.png';
        cancelButton.alt = 'Cancel';
        cancelButton.classList.add('cancel-button');
        
        taskSpan.addEventListener('click', () => {
            taskSpan.classList.toggle('completed');
            saveTasks();
        });
        
        cancelButton.addEventListener('click', (e) => {
            e.stopPropagation();
            listItem.remove();
            saveTasks();
        });
        
        listItem.appendChild(taskSpan);
        listItem.appendChild(cancelButton);
        
        taskList.appendChild(listItem);
    }

    // Load saved tasks when the page loads
    loadTasks();

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            return; 
        }

        addTaskToList(taskText);
        saveTasks();
        
        taskInput.value = '';
    });
});