import { generateRandomNumber } from './helpers.js';
import { openFullScreenPicture } from './rendering-thumbnails-full-screen.js';

const RANDOM_PHOTO_COUNT = 10;
const otherUsersPictureContainer = document.querySelector('.pictures');
const randomPictureTamlate = document.querySelector('#picture').content.querySelector('.picture');
const elementErr = document.querySelector('#error-get-data');
const imageFilter = document.querySelector('.img-filters');
const filterButtons = document.querySelectorAll('.img-filters__button');
const activeButtonClassCss = 'img-filters__button--active';

//Показать фильтры
const visibleFilter = () => {
  imageFilter.classList.remove('img-filters--inactive');
};

//Удаление миниатюр
const unrenderThumbnails = () => {
  const pictures = document.querySelectorAll('.picture');
  pictures.forEach((picture) => {
    picture.parentNode.removeChild(picture);
  });
};

//Отрисовка миниатюр
const renderThumbnails = (images) => {
  unrenderThumbnails();
  images.forEach((value) => {
    let randomPicturefragment = document.createDocumentFragment();
    randomPicturefragment = randomPictureTamlate.cloneNode(true);
    randomPicturefragment.querySelector('.picture__img').src = value.url;
    randomPicturefragment.querySelector('.picture__info').querySelector('.picture__likes').textContent = value.likes;
    randomPicturefragment.querySelector('.picture__info').querySelector('.picture__comments').textContent = value.comments.length;
    otherUsersPictureContainer.appendChild(randomPicturefragment);
  });
  const pictures = document.querySelectorAll('.picture');
  openFullScreenPicture(pictures, images);
};

//Генерация массива со случайными фотками и уникальными
const generateRandomUnicPictures = (data, len) => {
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
const selectData = (id, data) => {
  if (id === 'filter-default') {
    renderThumbnails(data);
  }
  if (id === 'filter-random') {
    renderThumbnails(generateRandomUnicPictures(data, RANDOM_PHOTO_COUNT));
  }
  if (id === 'filter-discussed') {
    renderThumbnails(sortByComments(data));
  }
};

//Переменная чтобы вынести данные в глобал
let loadedData = [];

//Кол-бэк для фильтров
const selectFilter = (evt) => {
  evt.preventDefault();
  filterButtons.forEach((button) => {
    if (evt.target === button) {
      evt.target.classList.add(activeButtonClassCss);
      selectData(button.id, loadedData);
    } else {
      button.classList.remove(activeButtonClassCss);
    }
  });
};

//Обработчик
const workFilter = (data) => {
  loadedData = data;
  visibleFilter();
  renderThumbnails(data);
  filterButtons.forEach((button) => {
    button.addEventListener('click', onFilterClick);
  });
};

//Функция вывода текста ошибки при загрузки данных
function showErrorMessageFromGetData() {
  elementErr.style.display = 'flex';
}

export { workFilter, showErrorMessageFromGetData };
