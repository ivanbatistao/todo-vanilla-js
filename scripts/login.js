window.addEventListener('load', function () {
  /* ---------------------- Getting global variables ---------------------- */
  const form = document.forms[0];
  const email = document.querySelector('#input-email');
  const password = document.querySelector('#input-password');
  const url = 'https://ctd-todo-api.herokuapp.com/v1';

  /* -------------------------------------------------------------------------- */
  /*       Funcionality 2: Make an API request to access the app [POST]         */
  /* -------------------------------------------------------------------------- */
  function login(settings) {
    fetch(`${url}/users/login`, settings)
      .then((response) => {
        if (response.ok != true) {
          alert('Alguno de los datos es incorrecto.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.jwt) {
          localStorage.setItem('jwt', JSON.stringify(data.jwt));
          location.replace('./my-tasks.html');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /* -------------------------------------------------------------------------- */
  /*     Funcionality 1: Listen to the submit event and prepare the data        */
  /* -------------------------------------------------------------------------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const payload = {
      email: email.value,
      password: password.value,
    };

    const settings = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'application/json; charset=utf-8',
      },
    };

    login(settings);
    form.reset();
  });
});
