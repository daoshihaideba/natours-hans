import axios from 'axios';
import { showAlert } from './alert';
export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Sign Up successfully!');
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
    console.log(err);
  }
};
