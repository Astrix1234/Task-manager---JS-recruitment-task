'use strict';

const addTaskForm = document.querySelector('.addTask');
const addTaskInput = document.querySelector('.addTask__input');
const taskList = document.querySelector('.tasksList');

const backdrop = document.querySelector('.backdrop');
const formEdit = document.querySelector('.edit');
const editTextarea = document.querySelector('.edit__textarea');
const editBtnClose = document.querySelector('.edit__btn-close');

let done = false;
let isSaveEditTaskAdded = false;

const taskFromLocalStorage = localStorage.getItem('task') || '[]';
const taskArrayFromLocalStorage = JSON.parse(taskFromLocalStorage);

const renderTaskList = () => {
  taskArrayFromLocalStorage.forEach(task => {
    if (task.task !== addTaskInput.value.trim()) {
      const taskElement = document.createElement('li');
      taskElement.classList.add('tasksList__item');
      const markup = `<p class="tasksList__text">${task.task}</p>
          <div class="tasksList__buttons">
            <button type="button" class="tasksList__btnDelate">Delate</button>
            <button type="button" class="tasksList__btnEdit">Edit</button>
            <button type="button" class="tasksList__btnDone">Mark as done</button>
          </div>`;
      taskElement.innerHTML = markup;
      taskList.append(taskElement);
      if (task.done) {
        taskElement.classList.add('tasksList__item--done');

        const buttonsContainer = taskElement.querySelector(
          '.tasksList__buttons'
        );
        const buttonsArray = Array.from(buttonsContainer.children);

        const lastButton = buttonsArray[buttonsArray.length - 1];
        if (lastButton) {
          lastButton.classList.add('tasksList__btnDone--unvisitable');
          lastButton.disabled = true;
        }

        const beforeLastButton = buttonsArray[buttonsArray.length - 2];
        if (beforeLastButton) {
          beforeLastButton.classList.add('tasksList__btnEdit--unvisitable');
          beforeLastButton.disabled = true;
        }
      }
    }
  });
};

renderTaskList();

const addToTaskList = e => {
  e.preventDefault();
  const value = addTaskInput.value.trim();
  if (value === '') {
    alert('You must enter a task');
    return;
  }
  const taskFromLocalStorage = localStorage.getItem('task') || '[]';
  const taskArrayFromLocalStorage = JSON.parse(taskFromLocalStorage);
  if (taskArrayFromLocalStorage.every(task => task.task !== value)) {
    const taskElement = document.createElement('li');
    taskElement.classList.add('tasksList__item');
    const markup = `<p class="tasksList__text">${value}</p>
          <div class="tasksList__buttons">
            <button type="button" class="tasksList__btnDelate">Delate</button>
            <button type="button" class="tasksList__btnEdit">Edit</button>
            <button type="button" class="tasksList__btnDone">Mark as done</button>
          </div>`;
    taskElement.innerHTML = markup;
    taskList.appendChild(taskElement);

    const objectTask = {
      task: value,
      done: done,
    };
    taskArrayFromLocalStorage.push(objectTask);
    localStorage.setItem('task', JSON.stringify(taskArrayFromLocalStorage));
    addTaskInput.value = '';
  } else {
    alert('This task already exists');
  }
};

const delateTask = e => {
  if (e.target.classList.contains('tasksList__btnDelate')) {
    e.target.parentElement.parentElement.remove();
    const taskFromLocalStorage = localStorage.getItem('task') || '[]';
    const taskArrayFromLocalStorage = JSON.parse(taskFromLocalStorage);
    const taskArrayFromLocalStorageFiltered = taskArrayFromLocalStorage.filter(
      task =>
        task.task !==
        e.target.parentElement.parentElement.firstElementChild.textContent
    );
    localStorage.setItem(
      'task',
      JSON.stringify(taskArrayFromLocalStorageFiltered)
    );
  }
};

const markAsDoneTask = e => {
  if (e.target.classList.contains('tasksList__btnDone')) {
    const taskFromLocalStorage = localStorage.getItem('task') || '[]';
    const taskArrayFromLocalStorage = JSON.parse(taskFromLocalStorage);
    taskArrayFromLocalStorage.forEach(task => {
      if (
        task.task ===
        e.target.parentElement.parentElement.firstElementChild.textContent
      ) {
        task.done = true;
      }
    });
    localStorage.setItem('task', JSON.stringify(taskArrayFromLocalStorage));

    e.target.parentElement.parentElement.classList.add('tasksList__item--done');
    e.target.parentElement.parentElement.lastElementChild.lastElementChild.classList.add(
      'tasksList__btnDone--unvisitable'
    );
    e.target.parentElement.parentElement.lastElementChild.lastElementChild.disabled = true;

    const buttonsContainer = e.target.parentElement;
    const buttonsArray = Array.from(buttonsContainer.children);
    const beforeLastButton = buttonsArray[buttonsArray.length - 2];
    if (beforeLastButton) {
      beforeLastButton.classList.add('tasksList__btnEdit--unvisitable');
      beforeLastButton.disabled = true;
    }
  }
};

const editTask = e => {
  if (e.target.classList.contains('tasksList__btnEdit')) {
    backdrop.classList.remove('is-hidden');
    formEdit.classList.remove('is-hidden');

    editBtnClose.addEventListener('click', closeEditForm);
    backdrop.addEventListener('click', closeEditFormByBackdrop);
    document.addEventListener('keydown', closeEditFormByEsc);

    const editText = e.target.parentElement.parentElement.firstElementChild;
    editTextarea.value = editText.textContent;

    const saveEditTask = e => {
      e.preventDefault();

      const oldTaskText = editText.textContent;
      editText.textContent = editTextarea.value;

      const taskFromLocalStorage = localStorage.getItem('task') || '[]';
      const taskArrayFromLocalStorage = JSON.parse(taskFromLocalStorage);

      const taskToUpdate = taskArrayFromLocalStorage.find(
        task => task.task === oldTaskText
      );

      if (taskToUpdate) {
        taskToUpdate.task = editTextarea.value;
      }
      localStorage.setItem('task', JSON.stringify(taskArrayFromLocalStorage));
      closeEditForm();
      formEdit.removeEventListener('submit', saveEditTask);
      isSaveEditTaskAdded = false;
    };
    if (!isSaveEditTaskAdded) {
      formEdit.addEventListener('submit', saveEditTask);
      isSaveEditTaskAdded = true;
    }
  }
};

const closeEditForm = () => {
  backdrop.classList.add('is-hidden');
  formEdit.classList.add('is-hidden');
  backdrop.removeEventListener('click', closeEditFormByBackdrop);
  document.removeEventListener('keydown', closeEditFormByEsc);
};

const closeEditFormByBackdrop = e => {
  if (e.target === backdrop) {
    closeEditForm();
  }
};

const closeEditFormByEsc = e => {
  if (e.key === 'Escape') {
    closeEditForm();
  }
};

addTaskForm.addEventListener('submit', addToTaskList);
taskList.addEventListener('click', delateTask);
taskList.addEventListener('click', markAsDoneTask);
taskList.addEventListener('click', editTask);

// localStorage.clear();
