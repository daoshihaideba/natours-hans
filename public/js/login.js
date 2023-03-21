import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');

      // user = res.data.data.user;
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
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

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) {
      showAlert('success', 'Logged out successfully!');
      localStorage.removeItem('user');

      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
