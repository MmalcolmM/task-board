// Define variables for different elements in the task board
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));                                             

// Function to generate a unique task id
function generateTaskId() {
   if (nextId === null){
       nextId = 1
    } else {
       nextId++;
   }
    localStorage.setItem('nextId', JSON.stringify(nextId));
    return nextId;
}

// Function to create a task card
function createTaskCard(task) {
   const taskCard = $("<div>")
      .addClass('task-card draggable my-3)   
      .attr('data-task-id', task.id);
   const cardHeader = $("<div>").addClass('card-header-h3').text(task.title);
   const cardBody = $("<div>").addClass('card-body');
   const cardDescription = $("<p>").addClass('card-text').text(task.description);
   const cardDueDate = $("<p>").addClass('card-text').text('task.dueDate');
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
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
   taskCard.append(cardHeader, cardbody)

   return taskCard;
}



/// Function to render the task list and make cards dragga
function renderTaskList() {
    // Clear the task lists
    $('#todoCards').empty()
    $('#inProgressCards').empty()
    $('#doneCards').empty()

   for (let i = 0; i < taskList.length; i++){
      if (taskList[i].status === "to-do") {
         $("#todoCards").append(createTaskCard(taskList[i]))
      } else if (taskList[i].status === "in-progress") {
         $("#inProgressCards").append(createTaskCard[taskList[i]))
      } else {
         $("#doneCards").append(createTaskCard[taskList[i]))
      }

   }
   
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
}

 // Function to handle adding a new task
    function handleAddTask(event) {
        event.preventDefault();
        // Check for empty input fields
        if (taskNameInput.val() === '' || dueDateInput.val() === '' || taskDescriptionInput.val() === '') {
            alert('You can\'t leave nothing blank \'round\ here');
            return;

            // Create a new task object
            const newTask = {
                title: $("taskNamee").val(),
                dueDate: $("#dueDate").val(),
                taskDescription: $("#taskDescription").val(),
                id: generateTaskId(),
                status: "Time to start",
            };

            // Add new task to tasks array
            taskLists.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(taskList));

            // Clear input fields and render updated task list
           renderTaskList();

           $("#taskName").val("");
           $("#taskDescription").val("");
           $("#dueDate").val("");
        }
    }



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
   const taskId = ui.draggable.attr("data-task-id);
   const newStatus = event.target.id;

   const task = taskList.find(task => task.id == taskId);
       if (task) {
         task.status = newStatus;
         localStorage.setItem("tasks", JSON.stringify(taskList));
           renderTaskList();
       }
}
  


    // When the page loads, render the task list and make the due date field a date picker
$(document).ready(function () {
    
    renderTaskList();

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop
    });

    $('#taskForm').on('submit', handleAddTask)
});

