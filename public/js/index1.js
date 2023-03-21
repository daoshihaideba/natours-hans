import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
const bookBtn = document.getElementById('book-tour');

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    console.log(1111111, bookBtn);
    e.target.textContent = 'Processing......';
    const { tourId } = e.target.dataset;

    bookTour(tourId);
    setTimeout(() => {
      e.target.textContent = 'Book now';
    }, 3000);
  });
//DOM ELEMENTS
const updateUI = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userNav = document.querySelector('.nav--user');
  if (user) {
    // 用户已登录，更新用户区域为用户头像和登出按钮
    const userHtml = `
      <a class="nav__el nav__el--logout">Log out</a>
      <a class="nav__el" href="/me">
        <img class="nav__user-img" src="/img/users/${user.photo}" alt="${user.name}" />
        <span>${user.name}</span>
      </a>
    `;
    userNav.innerHTML = userHtml;
  } else {
    // 用户未登录，更新用户区域为登录和注册按钮
    const userHtml = `
      <a class="nav__el" href="/login">Log in</a>
      <a class="nav__el nav__el--cta" href="/signup">Sign up</a>
    `;
    userNav.innerHTML = userHtml;
  }
};

window.addEventListener('load', updateUI);
window.onload = function() {
  // Your code here
  const mapBox = document.getElementById('map');
  const loginform = document.querySelector('.form--login');
  const logoutBtn = document.querySelector('.nav__el--logout');
  const userDataForm = document.querySelector('.form-user-data');
  const userPasswordForm = document.querySelector('.form-user-password');
  //VALUES

  //delegation
  if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
  }

  if (loginform) {
    loginform.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  }

  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  if (userDataForm)
    userDataForm.addEventListener('submit', e => {
      e.preventDefault();
      const form = new FormData();
      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      form.append('photo', document.getElementById('photo').files[0]);
      console.log(1111111, form);
      updateSettings(form, 'data');
    });
  if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Updating...';

      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;

      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password'
      );
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
      document.querySelector('.btn--save-password').textContent =
        'SAVE PASSWORD';
    });
};
