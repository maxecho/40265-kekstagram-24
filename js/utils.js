// Функция соответсвия кол-ва символов в строке заданному числу
function checkStringLength (string, length) {
  return string.length <= length;
}
checkStringLength(2,5);
// Функция создающая рандомное целое число из диапозона
function getRandomPositiveInteger (numberA, numberB) {
  const lower = Math.ceil(Math.min(Math.abs(numberA), Math.abs(numberB)));
  const upper = Math.floor(Math.max(Math.abs(numberA), Math.abs(numberB)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}
getRandomPositiveInteger(5,100);

// Функция чтобы вытаскивать случайный элемент из массива
const getRandomArrayElement = (elements) => elements[_.random(0, elements.length - 1)];

export {checkStringLength, getRandomPositiveInteger, getRandomArrayElement};
