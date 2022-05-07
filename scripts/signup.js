window.addEventListener('load', function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const form = document.forms[0];
  const name = document.querySelector('#input-name');
  const lastname = document.querySelector('#input-lastname');
  const email = document.querySelector('#input-email');
  const password = document.querySelector('#input-password');
  const url = 'https://ctd-todo-api.herokuapp.com/v1';

  /* -------------------------------------------------------------------------- */
  /*             Funcionality 2: Make an API request to signup                  */
  /* -------------------------------------------------------------------------- */
  function signup(settings) {
    console.log(settings);
    fetch(`${url}/users`, settings)
      .then((response) => {
        if (response.ok != true) {
          alert('Alguno de los datos es incorrecto.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.jwt) {
          localStorage.setItem('jwt', JSON.stringify(data.jwt));
          location.replace('/my-tasks.html');
        } else {
          alert(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /* -------------------------------------------------------------------------- */
  /*    Funcionality 1: Listen to the submit event and prepare data to send     */
  /* -------------------------------------------------------------------------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const payload = {
      firstName: name.value,
      lastName: lastname.value,
      email: email.value,
      password: password.value,
    };
    const settings = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    signup(settings);
    form.reset();
  });
});
