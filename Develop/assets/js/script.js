// Define variables for different elements in the task board
$(document).ready(function(){
const todoList = $('#todoCards');
const inProgressList = $('#inProgressCards');
const doneList = $('#doneCards');
const taskNameInput = $("#taskName");
const dueDateInput = $("#dueDate");
const taskDescriptionInput = $("#taskDescription");
// const deleteBtn = $('.deleteBtn');
// const lane = $('.laneList');

    function startDatePicker(){
        $(#duteDate").datepicker();
          }
    startDatePicker();
// Set the z-index of lane elements to -1
lane.css('z-index', '-1');

// Function to generate a unique task id
function generateTaskId() {
    let nextId = JSON.parse(localStorage.getItem("nextId"));
    if (!nextId) {
        nextId = 0;
    }
    nextId++;
    localStorage.setItem('nextId', nextId);
    return nextId;
}

// Function to create a task card
function createTaskCard(task) {
    const newCard = $('<li>').css('z-index', '50').attr('data-taskId', task.id).addClass("taskCard");
    const newCardBody = $('<div>').addClass("card-body draggable").attr('data-nextId', task.id);
    const newTaskName = $('<h2>').addClass("card-title").text(task.title);
    const newDueDateField = $('<p>').addClass("card-text").text("Due date: " + task.dueDate);
    const newStatus = $('<p>').addClass("card-text cardStatusText").text("Status: " + task.status);
    const newDescription = $('<p>').addClass("card-text").text(task.description);
    const newDeleteButton = $('<button>').addClass("btn btn-danger custom-delete-btn deleteBtn").text('Delete').attr('data-nextId', task.id);

    // Check task due date and status for color coding
    if (task.dueDate && task.status !== 'done') {
        const today = dayjs();
        const dueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
        if (today.isSame(dueDate, 'day')) {
            newCard.addClass('bg-warning text-white card draggable');
        } else if (today.isAfter(dueDate)) {
            newCard.addClass('bg-danger text-white card draggable');
        } else {
            newCard.addClass('card bg-info draggable');
        }
    } else {
        newCard.addClass('card bg-success draggable');
    }

    // Append elements to the card
    newCardBody.append(newTaskName, $('<hr>'), newDueDateField, newStatus, newDescription, newDeleteButton);
    newCard.append(newCardBody);

    return newCard;
}



/// Function to render the task list and make cards draggable
function renderTaskList() {
    // Clear the task lists
    todoList.empty();
    inProgressList.empty();
    doneList.empty();

    // Make task cards draggable
    $(function() {
        $(".taskCard").draggable({
            cancel: ".deleteBtn", // Prevent dragging when clicking the delete button
            revert: "invalid", // Revert the card if not dropped in a valid location
        });
    });

    // Retrieve tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    if (!tasks) {
        tasks = [];
    }

    // Iterate through tasks and append to the appropriate list
    for (let task of tasks) {
        if (task.status == "Time to start") {
            todoList.append(createTaskCard(task)); // Append task card to the "To Do" list
        } else if (task.status == "inProgress") {
            inProgressList.append(createTaskCard(task)); // Append task card to the "In Progress" list
        } else if (task.status == "done") {
            doneList.append(createTaskCard(task)); // Append task card to the "Done" list
        }
    }
}

 // Function to handle adding a new task
    function handleAddTask(event) {
        event.preventDefault();
        // Check for empty input fields
        if (taskNameInput.val() === '' || dueDateInput.val() === '' || taskDescriptionInput.val() === '') {
            alert('You can\'t leave nothing blank \'round\ here');
            return;
        } else {
            // Get task details from input fields
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const taskName = taskNameInput.val();
            const taskDueDate = dueDateInput.val();
            const taskDescription = taskDescriptionInput.val();

            // Create a new task object
            const newTask = {
                title: taskName,
                dueDate: taskDueDate,
                description: taskDescription,
                id: generateTaskId(),
                status: "Time to start",
            };

            // Add new task to tasks array
            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // Clear input fields and render updated task list
            taskNameInput.val('');
            dueDateInput.val('');
            taskDescriptionInput.val('');
            renderTaskList();
        }
    }
// Event listener for adding a new task
    $(".taskForm").on('submit', handleAddTask);


// Function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(this).attr('data-task-id');
    let tasks = JSON.parse(localStorage.getItem('tasks'));

    // Filter out the task to be deleted
    tasks = tasks.filter(task => task.id !== taskId);
    tasks = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasks);

    // Reload the page to reflect the updated task list
    location.reload();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    let taskId = ui.draggable[0].dataset.taskid;
    let dropStatus = $(this).attr('data-status');

    // Update the status of the dropped task
    for (let task of tasks) {
        if (task.id == taskId) {
            task.status = dropStatus;
        }
    }

    // Update task list in localStorage and render updated task list
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
}

    // When the page loads, render the task list and make the due date field a date picker
    renderTaskList();

    // Initialize date picker for due date input field
    $(function() {
        $("#dueDate").datepicker();
    });
});

    // Add event listener for adding a new task
    $(".taskForm").on('submit', handleAddTask);

    // Make lanes droppable for task movement
    $('.lane').droppable({
        classes: {
            "ui-droppable-active": "ui-state-highlight"
        },
        drop: handleDrop,
    });
});

// Event listener for delete button
$('.laneList').on('click', '.deleteBtn', handleDeleteTask);


