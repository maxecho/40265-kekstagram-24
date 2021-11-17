const DEBOUNCE_TIMEOUT = 500;

//Функция, возвращающая случайное целое число из переданного диапазона включительно
const generateRandomNumber = (from, to) => {
  if (from < 0 || to < 0 || to <= from) {
    return -1;
  }
  return Math.floor(Math.random() * (to - from) + from);
};

//События для кнопок
const isEscapeKey = (evt) => evt.key === 'Escape';

//Создание NoUiSlider
const createNoUiSlider = (sliderElement) => {
  noUiSlider.create(sliderElement, {
    range: {
      min: 0,
      max: 1,
    },
    start: 0,
    step: 0.1,
    connect: 'lower',
    format: {
      to: function (value) {
        if (Number.isInteger(value)) {
          return value.toFixed(0);
        }
        return value.toFixed(1);
      },
      from: function (value) {
        return parseFloat(value);
      },
    },
  });
};

const debounce = (callback) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), DEBOUNCE_TIMEOUT);
  };
};

export { generateRandomNumber, isEscapeKey, createNoUiSlider, debounce };
