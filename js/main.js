// Колбэк для Telegram-виджета - должен быть определён ДО загрузки виджета
window.onTelegramAuth = function(user) {
  localStorage.setItem('tg_user', JSON.stringify(user));
  renderCabinet();
};

// Элементы
const modal = document.getElementById('modal-login');
const openBtn = document.querySelector('.header__button');
const backdrop = modal.querySelector('.modal__backdrop');
const closeBtn = modal.querySelector('.modal__dialog-close');
const content = document.getElementById('modal-login__content');
const headerInner = document.querySelector('.header__inner');

// Функция показа модалки
function showModal() {
  modal.classList.remove('visually-hidden');
}

// Функция скрытия модалки
function hideModal() {
  modal.classList.add('visually-hidden');
}

// Функция обновления кнопки "Личный кабинет" в шапке
function renderCabinet() {
  const userData = localStorage.getItem('tg_user');

  if (!userData) {
    // Если не авторизован - показываем обычную кнопку
    openBtn.innerHTML = 'Личный кабинет';
    openBtn.onclick = () => {
      renderModalContent();
      showModal();
    };
  } else {
    // Если авторизован - показываем аватар, имя и кнопку выхода
    const user = JSON.parse(userData);
    openBtn.innerHTML = `
      <img src="${user.photo_url || ''}" alt="avatar" style="width:32px; height:32px; border-radius:50%; vertical-align:middle; margin-right:8px;">
      <span>${user.first_name}</span>
      <button id="btn-logout" style="margin-left:12px; padding:4px 8px; font-size:14px; cursor:pointer;">Выйти</button>
    `;
    openBtn.onclick = null; // отключаем показ модалки по клику на кнопку

    // Обработчик выхода
    document.getElementById('btn-logout').addEventListener('click', () => {
      localStorage.removeItem('tg_user');
      renderCabinet();
    });
  }
}

// Рендерим содержимое модалки с Telegram Login Widget или приветствием
function renderModalContent() {
  const userData = localStorage.getItem('tg_user');
  content.innerHTML = '';

  if (!userData) {
    // Вставляем Telegram Login Widget
    const tgScript = document.createElement('script');
    tgScript.async = true;
    tgScript.src = 'https://telegram.org/js/telegram-widget.js?15';
    tgScript.setAttribute('data-telegram-login', 'ocgStudioBot'); // имя вашего бота
    tgScript.setAttribute('data-size', 'large');
    tgScript.setAttribute('data-userpic', 'false');
    tgScript.setAttribute('data-request-access', 'write');
    tgScript.setAttribute('data-onauth', 'onTelegramAuth');
    content.appendChild(tgScript);
  } else {
    const user = JSON.parse(userData);
    content.innerHTML = `
      <p>Привет, ${user.first_name}!</p>
      <button type="button" id="btn-logout-modal" class="modal__dialog-close">Выйти</button>
    `;
    document.getElementById('btn-logout-modal').addEventListener('click', () => {
      localStorage.removeItem('tg_user');
      renderCabinet();
      hideModal();
    });
  }
}

// Навешиваем события для модалки
openBtn.addEventListener('click', () => {
  if (!localStorage.getItem('tg_user')) {
    renderModalContent();
    showModal();
  }
});
backdrop.addEventListener('click', hideModal);
closeBtn.addEventListener('click', hideModal);

// При загрузке страницы сразу обновляем кнопку
document.addEventListener('DOMContentLoaded', () => {
  renderCabinet();
});
