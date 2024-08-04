document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    let draggingEle;
    let placeholder;
    let isDraggingStarted = false;

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(li => ({
            text: li.querySelector('.task-text').textContent,
            completed: li.querySelector('.task-text').classList.contains('completed')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => addTaskToList(task.text, task.completed));
    }

    function addTaskToList(text, completed = false) {
        const listItem = document.createElement('li');
        listItem.draggable = true;

        const editButton = document.createElement('img');
        editButton.src = 'edit.png';
        editButton.alt = 'Edit';
        editButton.classList.add('edit-button');

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

        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const newText = prompt("Edit your task:", taskSpan.textContent);
            if (newText !== null && newText.trim() !== '') {
                taskSpan.textContent = newText.trim();
                saveTasks();
            }
        });

        listItem.appendChild(editButton);
        listItem.appendChild(taskSpan);
        listItem.appendChild(cancelButton);
        taskList.appendChild(listItem);


        listItem.addEventListener('dragstart', handleDragStart);
        listItem.addEventListener('dragover', handleDragOver);
        listItem.addEventListener('drop', handleDrop);
        listItem.addEventListener('dragend', handleDragEnd);
    }

    
    function handleDragStart(e) {
        draggingEle = this;
        isDraggingStarted = false;

      
        placeholder = document.createElement('li');
        placeholder.classList.add('placeholder');
        placeholder.style.height = `${this.offsetHeight}px`;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        this.classList.add('dragging');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (!isDraggingStarted) {
            isDraggingStarted = true;
            this.parentNode.insertBefore(placeholder, this.nextSibling);
        }
        return false;
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (draggingEle !== this) {
          
            draggingEle.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');

      
            this.parentNode.insertBefore(draggingEle, this);
        }

        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        if (placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
        }
        saveTasks();
    }

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
