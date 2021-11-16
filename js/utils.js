//Функция, возвращающая случайное целое число из переданного диапазона включительно
const generateRandomNumber = (from, to) => {
  if (from < 0 || to < 0 || to <= from) {
    return -1;
  }
  const result = Math.floor(Math.random() * (to - from) + from);
  return result;
};

//Проверка длины собщения
const testingStringLength = (inputString, acceptLength) => {
  const stringLength = inputString.length;
  return (stringLength <= acceptLength);
};

//События для кнопок
const isEscapeKey = (evt) => evt.key === 'Escape';
const isEnterKey = (evt) => evt.key === 'Enter';

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

export { generateRandomNumber, testingStringLength, isEscapeKey, isEnterKey, createNoUiSlider };
