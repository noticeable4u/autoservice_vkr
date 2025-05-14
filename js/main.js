// Глобальный колбэк для Telegram Login Widget
window.onTelegramAuth = function(user) {
  localStorage.setItem('tg_user', JSON.stringify(user));
  updateHeader();
  hideModal();
};

// Элементы
const btnCabinet = document.getElementById('btn-cabinet');
const userInfo = document.getElementById('user-info');
const userAvatar = document.getElementById('user-avatar');
const userGreeting = document.getElementById('user-greeting');
const btnOpenCabinet = document.getElementById('btn-open-cabinet');
const modal = document.getElementById('modal-login');
const modalContent = document.getElementById('modal-login__content');
const backdrop = modal.querySelector('.modal__backdrop');
const closeBtn = modal.querySelector('.modal__dialog-close');

// Обновление шапки в зависимости от статуса авторизации
function updateHeader() {
  const userData = localStorage.getItem('tg_user');
  if (!userData) {
    btnCabinet.style.display = 'inline-block';
    userInfo.style.display = 'none';
  } else {
    const user = JSON.parse(userData);
    btnCabinet.style.display = 'none';
    userInfo.style.display = 'flex';
    userAvatar.src = user.photo_url || './images/logo.png';
    userGreeting.textContent = `Здравствуйте, ${user.first_name}!`;
  }
}

// Открыть модалку с содержимым личного кабинета
function openCabinetModal() {
  modal.classList.remove('visually-hidden');
  renderModalContent();
}

// Закрыть модалку
function closeCabinetModal() {
  modal.classList.add('visually-hidden');
}

// Рендер содержимого модалки
function renderModalContent() {
  const userData = localStorage.getItem('tg_user');
  modalContent.innerHTML = '';

  if (!userData) {
    // Показываем Telegram Login Widget
    const tgScript = document.createElement('script');
    tgScript.async = true;
    tgScript.src = 'https://telegram.org/js/telegram-widget.js?15';
    tgScript.setAttribute('data-telegram-login', 'ocgStudioBot'); // замените на имя вашего бота
    tgScript.setAttribute('data-size', 'large');
    tgScript.setAttribute('data-userpic', 'false');
    tgScript.setAttribute('data-request-access', 'write');
    tgScript.setAttribute('data-onauth', 'onTelegramAuth');
    modalContent.appendChild(tgScript);
  } else {
    // Показываем личный кабинет с формой записи и кнопкой выхода
    modalContent.innerHTML = `
      <h2>Личный кабинет</h2>
      <p>Добро пожаловать, ${JSON.parse(userData).first_name}!</p>
      <form id="booking-form">
        <label for="service">Выберите услугу:</label>
        <select id="service" required>
          <option value="" disabled selected>-- Выберите услугу --</option>
          <option value="diagnostics">Диагностика</option>
          <option value="repair">Ремонт</option>
          <option value="tuning">Тюнинг</option>
          <option value="painting">Покраска</option>
        </select>
        <br /><br />
        <label for="datetime">Выберите дату и время:</label>
        <input type="datetime-local" id="datetime" required min="" />
        <br /><br />
        <button type="submit">Записаться</button>
      </form>
      <div id="booking-message" style="margin-top:15px; color: green;"></div>
      <button id="btn-logout" style="margin-top:20px;">Выйти</button>
    `;

    // Установка минимальной даты для input datetime-local
    const datetimeInput = document.getElementById('datetime');
    const now = new Date();
    now.setHours(now.getHours() + 1);
    datetimeInput.min = now.toISOString().slice(0,16);

    // Обработка отправки формы записи
    const bookingForm = document.getElementById('booking-form');
    const bookingMessage = document.getElementById('booking-message');
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      const service = document.getElementById('service').value;
      const datetime = datetimeInput.value;
      if (!service || !datetime) {
        alert('Пожалуйста, выберите услугу и дату/время.');
        return;
      }
      // Проверка занятости времени (локально)
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      if (bookings.some(b => b.datetime === datetime)) {
        alert('Выбранное время уже занято. Пожалуйста, выберите другое.');
        return;
      }
      bookings.push({ user: JSON.parse(userData), service, datetime });
      localStorage.setItem('bookings', JSON.stringify(bookings));
      bookingMessage.textContent = `Вы успешно записались на услугу "${service}" на ${new Date(datetime).toLocaleString()}.`;
      bookingForm.reset();
      datetimeInput.min = new Date(Date.now() + 3600000).toISOString().slice(0,16);
    });

    // Кнопка выхода
    document.getElementById('btn-logout').addEventListener('click', () => {
      localStorage.removeItem('tg_user');
      // Если хотите очистить записи при выходе, раскомментируйте следующую строку
      // localStorage.removeItem('bookings');
      updateHeader();
      closeCabinetModal();
    });
  }
}

// Обработчики кликов
btnCabinet.addEventListener('click', () => {
  renderModalContent();
  showModal();
});
btnOpenCabinet.addEventListener('click', () => {
  openCabinetModal();
});
backdrop.addEventListener('click', closeCabinetModal);
closeBtn.addEventListener('click', closeCabinetModal);

function showModal() {
  modal.classList.remove('visually-hidden');
}

function hideModal() {
  modal.classList.add('visually-hidden');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  updateHeader();
});
