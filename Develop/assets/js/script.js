// Retrieve tasks and nextId from localStorage


const todoList= $('#todoCards');
const inProgressList = $('#inProgressCards');
const doneList = $('#doneCards');
const taskNameInput = $("#taskName");
const dueDateInput =$("#dueDate");
const taskDescriptionInput = $("#taskDescription");
const deleteBtn = $('.deleteBtn');
const lane = $('.laneList');
lane.css('z-index', '-1');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    
    let nextId = JSON.parse(localStorage.getItem("nextId"));
    if (!nextId) {nextId = 0} 
    nextId++;
    localStorage.setItem('nextId', nextId);
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {

const newCard = $('<li>').css('z-index', '50').attr('data-taskId', task.id).addClass("taskCard");
const newCardBody = $('<div>').addClass("card-body draggable").attr('data-nextId', task.id)
const newTaskName = $('<h2>').addClass("card-title").text(task.title);
const newDueDateField = $('<p>').addClass("card-text").text("Due date: " + task.dueDate);
const newStatus = $('<p>').addClass("card-text cardStatusText").text("Status: " + task.status);
const newDescription = $('<p>').addClass("card-text").text(task.description);
const newDeleteButton = $('<button>').addClass("btn btn-danger custom-delete-btn deleteBtn").text('Delete').attr('data-nextId', task.id);



if (task.dueDate && task.status !== 'done') {
    const today = dayjs();
    const dueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    if (today.isSame(dueDate, 'day')) {
      newCard.addClass('bg-warning text-white card draggable');
    } else if (today.isAfter(dueDate)) {
      newCard.addClass('bg-danger text-white card draggable');
    } else {newCard.addClass('card bg-info draggable')}
    
} else {newCard.addClass('card bg-success draggable')}

newCardBody.append(newTaskName, $('<hr>'), newDueDateField, newStatus, newDescription, newDeleteButton);
newCard.append(newCardBody);


return newCard;
}



// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {  

    todoList.empty();
    inProgressList.empty();
    doneList.empty();
    
    $(function() {
        $(".taskCard").draggable({
            cancel: ".deleteBtn", // clicking an icon won't initiate dragging
            revert: "invalid", // when not dropped, the item will revert back to its initial position 
        });
    });
    
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    if (!tasks) {tasks = []}
    for (let task of tasks) {
        if (task.status == "Time to start"){
            todoList.append(createTaskCard(task));
        } else if (task.status == "inProgress"){
            inProgressList.append(createTaskCard(task));
        } else if (task.status == "done"){
            
            doneList.append(createTaskCard(task));
        }
        
    }



}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

if (taskNameInput.val()=== '' || dueDateInput.val()=== ''|| taskDescriptionInput.val()=== '' ){
    alert('You can\'t leave nothing blank \'round\ here');
    return;
} else {

let taskList = JSON.parse(localStorage.getItem("tasks"));
const taskName = taskNameInput.val();
const taskDueDate = dueDateInput.val();
const taskDescription = taskDescriptionInput.val();
console.log(taskList);
const newTask = {
    Name: taskName,
    dueDate: taskDueDate,
    description: taskDescription,
    id: generateTaskId(),
    status: "Time to start",
}
if (taskList == null) {
    taskList = []
}
taskList.push(newTask);
taskList = JSON.stringify(taskList);    
localStorage.setItem('tasks', taskList);

taskNameInput.val('')
dueDateInput.val('')
taskDescriptionInput.val('')
console.log(newTask)

renderTaskList();
}
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(this).attr('data-task-id');
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    
    tasks = tasks.filter(task => task.id !== taskId);
    
    tasks = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasks);
    
    location.reload();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    
     const tasks = JSON.parse(localStorage.getItem('tasks'));    
     let taskId = ui.draggable[0].dataset.taskid;
     let dropStatus = $(this).attr('data-status')
    
     console.log(dropStatus)
     console.log(taskId)
for (let task of tasks){
    if (task.id == taskId) {
        task.status = dropStatus;
    }    
}
localStorage.setItem('tasks', JSON.stringify(tasks));
renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $(function() {
        $( "#dueDate" ).datepicker();
    });
    
    $(".taskForm").on('submit',handleAddTask);
    $('.lane').droppable({
        classes: {
        "ui-droppable-active": "ui-state-highlight"
        },
        drop: handleDrop,
    });
    
});

$('.laneList').on('click', '.deleteBtn', handleDeleteTask)


