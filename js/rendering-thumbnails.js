import { generateRandomNumber, debounce } from './utils.js';
import { bindPictureClickEvents } from './rendering-thumbnails-full-screen.js';

const RANDOM_PHOTO_COUNT = 10;
const ACTIVE_BUTTON_CLASS = 'img-filters__button--active';
const Filters = {
  default: 'filter-default',
  random: 'filter-random',
  discussed: 'filter-discussed',
};
const otherUsersPictureContainer = document.querySelector('.pictures');
const randomPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const elementErr = document.querySelector('#error-get-data');
const imageFilter = document.querySelector('.img-filters');
const filterButtons = document.querySelectorAll('.img-filters__button');

//Показать фильтры
const showFilter = () => {
  imageFilter.classList.remove('img-filters--inactive');
};

//Удаление миниатюр
const removeThumbnails = () => {
  const pictures = document.querySelectorAll('.picture');
  pictures.forEach((picture) => {
    picture.parentNode.removeChild(picture);
  });
};

//Отрисовка миниатюр
const renderThumbnails = (images) => {
  removeThumbnails();
  const randomPictureFragment = document.createDocumentFragment();
  images.forEach((value) => {
    const clonedTemplate = randomPictureTemplate.cloneNode(true);
    clonedTemplate.querySelector('.picture__img').src = value.url;
    clonedTemplate.querySelector('.picture__info').querySelector('.picture__likes').textContent = value.likes;
    clonedTemplate.querySelector('.picture__info').querySelector('.picture__comments').textContent = value.comments.length;
    randomPictureFragment.appendChild(clonedTemplate);
  });

  otherUsersPictureContainer.appendChild(randomPictureFragment);
  const pictures = document.querySelectorAll('.picture');
  bindPictureClickEvents(pictures, images);
};

//Генерация массива со случайными фотками и уникальными
const generateRandomUniquePictures = (data, len) => {
  const newData = data.slice(0, data.length - 1);
  const result = [];
  for (let i = 0; i < len; i++) {
    const index = generateRandomNumber(0, newData.length - 1);
    result.push(newData[index]);
    newData.splice(index, 1);
  }
  return result;
};

//Сортировка по комменатриям
const sortByComments = (data) => {
  const result = data.slice(0, data.length - 1);
  result.sort((item1, item2) => item2.comments.length - item1.comments.length);
  return result;
};

//Функция выбора данных по условию фильтра
const selectData = debounce((id, data) => {
  if (id === Filters.default) {
    renderThumbnails(data);
  }
  if (id === Filters.random) {
    renderThumbnails(generateRandomUniquePictures(data, RANDOM_PHOTO_COUNT));
  }
  if (id === Filters.discussed) {
    renderThumbnails(sortByComments(data));
  }
});

//Переменная чтобы вынести данные в глобал
let loadedData = [];

//Кол-бэк для фильтров
const onFilterClick = (evt) => {
  evt.preventDefault();
  filterButtons.forEach((button) => {
    if (evt.target === button) {
      evt.target.classList.add(ACTIVE_BUTTON_CLASS);
      selectData(button.id, loadedData);
    } else {
      button.classList.remove(ACTIVE_BUTTON_CLASS);
    }
  });
};

//Обработчик
const setupFilters = (data) => {
  loadedData = data;
  showFilter();
  renderThumbnails(data);
  filterButtons.forEach((button) => {
    button.addEventListener('click', onFilterClick);
  });
};

//Функция вывода текста ошибки при загрузки данных
const showErrorMessageFromGetData = () => {
  elementErr.style.display = 'flex';
}

export { setupFilters, showErrorMessageFromGetData };
