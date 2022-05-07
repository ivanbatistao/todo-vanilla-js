/* -------------------------------------------------------------------------- */
/*                Redirects user to home if user is not login                 */
/* -------------------------------------------------------------------------- */

if (!localStorage.jwt && location.pathname !== '/index.html') {
  location.replace('./index.html');
}

/* ------------------- Funcionlanities after the page loads  ------------------ */
window.addEventListener('load', function () {
  const urlTasks = 'https://ctd-todo-api.herokuapp.com/v1/tasks';
  const urlUser = 'https://ctd-todo-api.herokuapp.com/v1/users/getMe';
  const token = JSON.parse(localStorage.jwt);

  const createNewTaskForm = document.querySelector('.new-task');
  const newTaskInput = document.querySelector('#new-task-input');
  const logoutBtn = document.querySelector('#logout');

  /* -------------------------------------------------------------------------- */
  /*                    Funcionality 2 - Get user data [GET]                    */
  /* -------------------------------------------------------------------------- */

  function getUser() {
    const settings = {
      method: 'GET',
      headers: {
        authorization: token,
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
    fetch(urlUser, settings)
      .then((response) => response.json())
      .then((data) => {
        const userName = document.querySelector('.user-info p');
        userName.innerText = data.firstName;
      })
      .catch((error) => console.error(error));
  }

  /* -------------------------------------------------------------------------- */
  /*                  Funcionality 6 - Change task status [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function addChangeListener() {
    const addChangeListenerBtns = document.querySelectorAll('.change');

    addChangeListenerBtns.forEach((btn) => {
      btn.addEventListener('click', function (event) {
        const id = event.target.id;
        const url = `${urlTasks}/${id}`;
        const payload = {};

        if (event.target.classList.contains('incomplete')) {
          payload.completed = false;
        } else {
          payload.completed = true;
        }

        const settingsCambio = {
          method: 'PUT',
          headers: {
            authorization: token,
            'Content-type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(payload),
        };
        fetch(url, settingsCambio).then((response) => {
          getUserTasks();
        });
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                   Funcionality 7 - Delete a task [DELETE]                  */
  /* -------------------------------------------------------------------------- */
  function addDeleteTaskListener() {
    const deleteBtns = document.querySelectorAll('.delete');

    deleteBtns.forEach((boton) => {
      boton.addEventListener('click', function (event) {
        swal({
          title: '¿Estás seguro que deseas eliminar esta tarea?',
          text: 'Una vez eliminada la tarea no se podrá recuperar.',
          icon: 'warning',
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            const id = event.target.id;
            const url = `${urlTasks}/${id}`;

            const settingsCambio = {
              method: 'DELETE',
              headers: {
                authorization: token,
                'Content-Type': 'application/json; charset=utf-8',
              },
            };
            fetch(url, settingsCambio).then((response) => {
              getUserTasks();
              if (response.ok) {
                swal({
                  title: '¡La tarea fue eliminada exitosamente!',
                  icon: 'success',
                });
              }
            });
          }
        });
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                   Funcionality 3 - Get user tasks [GET]                    */
  /* -------------------------------------------------------------------------- */

  function getUserTasks() {
    const settings = {
      method: 'GET',
      headers: {
        authorization: token,
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
    fetch(urlTasks, settings)
      .then((response) => response.json())
      .then((tasks) => {
        renderUserTasks(tasks);
        addChangeListener();
        addDeleteTaskListener();
      })
      .catch((error) => console.error(error));
  }

  /* -------------------------------------------------------------------------- */
  /*                     Funcionality 5 - Render user tasks                     */
  /* -------------------------------------------------------------------------- */
  function renderUserTasks(listado) {
    const pendingTasks = document.querySelector('.pending-tasks');
    const completedTasks = document.querySelector('.completed-tasks');
    pendingTasks.innerHTML = '';
    completedTasks.innerHTML = '';

    const completedTasksNumber = document.querySelector(
      '#completed-tasks-number'
    );
    let counter = 0;
    completedTasksNumber.innerText = counter;

    listado.forEach((task) => {
      let date = new Date(task.createdAt);

      if (task.completed) {
        counter++;
        completedTasks.innerHTML += `
            <li class="task">
              <div class="done">
                <i class="fa-regular fa-circle-check"></i>
              </div>
              <div class="description">
                <p class="name">${task.description}</p>
                <div class="change-status">
                  <button class="change incomplete" id="${task.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                  <button class="delete" id="${task.id}"><i class="fa-regular fa-trash-can"></i></button>
                </div>
              </div>
            </li>
                          `;
      } else {
        pendingTasks.innerHTML += `
            <li class="task">
              <button class="change" id="${
                task.id
              }"><i class="fa-regular fa-circle"></i></button>
              <div class="description">
                <p class="name">${task.description}</p>
                <p class="timestamp">${date.toLocaleDateString()}</p>
              </div>
            </li>
                          `;
      }
      completedTasksNumber.innerText = counter;
    });
  }

  getUser();
  getUserTasks();

  /* -------------------------------------------------------------------------- */
  /*                     Funcionality 1 - Log out                               */
  /* -------------------------------------------------------------------------- */

  logoutBtn.addEventListener('click', function () {
    swal({
      title: '¿Estás seguro que deseas cerrar sesión?',
      dangerMode: true,
      buttons: {
        cancel: true,
        confirm: {
          text: 'OK',
          value: true,
          visible: true,
          className: 'confirm',
          closeModal: true,
        },
      },
    }).then((willDelete) => {
      if (willDelete) {
        localStorage.clear();
        location.replace('./index.html');
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                 Funcionality 4 - Create a new task [POST]                  */
  /* -------------------------------------------------------------------------- */

  createNewTaskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const payload = {
      description: newTaskInput.value.trim(),
    };
    const settings = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        authorization: token,
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
    fetch(urlTasks, settings)
      .then((response) => response.json())
      .then((task) => {
        getUserTasks();
      })
      .catch((error) => console.log(error));

    createNewTaskForm.reset();
  });
});
