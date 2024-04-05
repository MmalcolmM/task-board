// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Function to create a task card
function createTaskCard(task) {
   const taskCard = $("<div>")
      .addClass('task-card draggable my-3')   
      .attr('data-task-id', task.id);
   const cardHeader = $("<div>").addClass('card-header-h3').text(task.title);
   const cardBody = $("<div>").addClass('card-body');
   const cardDescription = $("<p>").addClass('card-text').text(task.description);
   const cardDueDate = $("<p>").addClass('card-text').text(task.dueDate); // corrected
   const cardDeleteBtn = $("<button>").addClass('btn btn-danger delete').text('Delete').attr('data-task-id', task.id);
   cardDeleteBtn.on('click', handleDeleteTask);

    // Check task due date and status for color coding
    if (task.dueDate && task.status !== 'done') {
        const today = dayjs();
        const dueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
        if (today.isSame(dueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (today.isAfter(dueDate)) {
            taskCard.addClass('bg-danger text-white');
           cardDeleteBtn.addClass('border-light');
        }
    }

    // Append elements to the card
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn); // corrected
    taskCard.append(cardHeader, cardBody); // corrected

    return taskCard;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    // Clear the task lists
    $('#todoCards').empty();
    $('#inProgressCards').empty();
    $('#doneCards').empty();

    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].status === "to-do") {
            $("#todoCards").append(createTaskCard(taskList[i]));
        } else if (taskList[i].status === "in-progress") {
            $("#inProgressCards").append(createTaskCard(taskList[i]));
        } else {
            $("#doneCards").append(createTaskCard(taskList[i]));
        }
    }

    // Make task cards draggable
    $(".draggable").draggable({
        cancel: ".delete", // corrected
        revert: "invalid",
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    // Check for empty input fields
    if ($("#taskName").val() === '' || $("#dueDate").val() === '' || $("#taskDescription").val() === '') {
        alert('You can\'t leave nothing blank \'round\ here');
        return;
    }

    // Create a new task object
    const newTask = {
        title: $("#taskName").val(),
        dueDate: $("#dueDate").val(),
        description: $("#taskDescription").val(), // corrected
        id: generateTaskId(),
        status: "Time to start",
    };

    // Add new task to tasks array
    taskList.push(newTask); // corrected
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // Clear input fields and render updated task list
    renderTaskList();

    $("#taskName").val("");
    $("#taskDescription").val("");
    $("#dueDate").val("");
}

// When the page loads, render the task list and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop
    });

    $('#taskForm').on('submit', handleAddTask);
});

// Function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.currentTarget).data("task-id");
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    event.preventDefault();
    const taskId = ui.draggable.attr("data-task-id");
    const newStatus = event.target.id;

    const task = taskList.find(task => task.id == taskId);
    if (task) {
        task.status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }
}
