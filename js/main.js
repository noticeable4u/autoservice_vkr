// Колбэк для Telegram-виджета — должен быть определён ДО загрузки виджета
window.onTelegramAuth = function(user) {
  localStorage.setItem('tg_user', JSON.stringify(user));
  renderCabinet();
};

// Элементы модалки
const modal = document.getElementById('modal-login');
const openBtn = document.querySelector('.header__button');
const backdrop = modal.querySelector('.modal__backdrop');
const closeBtn = modal.querySelector('.modal__dialog-close');
const content = document.getElementById('modal-login__content');

// Показываем и скрываем модалку
function showModal() {
  modal.classList.remove('visually-hidden');
}

function hideModal() {
  modal.classList.add('visually-hidden');
}

// Рендерим содержимое модалки
function renderCabinet() {
  const userData = localStorage.getItem('tg_user');
  content.innerHTML = ''; // очищаем контейнер

  if (!userData) {
    // Telegram-виджет
    const tgScript = document.createElement('script');
    tgScript.async = true;
    tgScript.src = 'https://telegram.org/js/telegram-widget.js?15';
    tgScript.setAttribute('data-telegram-login', 'ocgStudioBot'); // <-- Имя твоего бота
    tgScript.setAttribute('data-size', 'large');
    tgScript.setAttribute('data-userpic', 'false');
    tgScript.setAttribute('data-request-access', 'write');
    tgScript.setAttribute('data-onauth', 'onTelegramAuth');

    content.appendChild(tgScript);
  } else {
    const user = JSON.parse(userData);
    content.innerHTML = `
      <p>Привет, ${user.first_name}!</p>
      <button
        type="button"
        id="btn-logout"
        class="modal__dialog-close"
      >Выйти</button>
    `;
    document.getElementById('btn-logout').addEventListener('click', () => {
      localStorage.removeItem('tg_user');
      renderCabinet();
    });
  }
}

// Навешиваем события
openBtn.addEventListener('click', () => {
  renderCabinet();
  showModal();
});

backdrop.addEventListener('click', hideModal);
closeBtn.addEventListener('click', hideModal);