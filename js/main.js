<<<<<<< Updated upstream
/* Hope i'll make it just on time */
=======
// Вспомогательные функции ил прошлого задания

function getRandomPositiveInteger(numberA, numberB) {
  const lower = Math.ceil(Math.min(Math.abs(numberA), Math.abs(numberB)));
  const upper = Math.floor(Math.max(Math.abs(numberA), Math.abs(numberB)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

// Функция чтобы вытаскивать случайный элемент из массива

const getRandomArrayElement = (elements) => elements[_.random(0, elements.length - 1)];

// Генерируем временные данные для проекта

const NUMBER_OF_GENERATED_DESCRIPTIONS = 25;
const numberOfCommentsPerPhoto = getRandomPositiveInteger(1, 2);

const MESSEGE = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];
const NAMES = [
  'Артём',
  'Иван',
  'Пётр',
  'Илья',
  'Павел',
  'Оксана',
  'Кристина',
  'Вика',
  'Оля',
  'Таисия',
];

const generateComments = () => ({
  id: getRandomPositiveInteger(1, 200),
  avatar: `img/avatar-${  getRandomPositiveInteger(0, 6)  }.svg`,
  message: getRandomArrayElement(MESSEGE),
  name: getRandomArrayElement(NAMES),
});

const commentsPerPhoto = Array.from(
  { length: numberOfCommentsPerPhoto },
  generateComments,
);

const createPhotoDescription = () => ({
  id: getRandomPositiveInteger(1, 25),
  url: `photos/${  getRandomPositiveInteger(1, 25)  }.jpg`,
  description: 'Ещё одна фотография с тонной коррекции и умной подписью',
  likes: getRandomPositiveInteger(15, 200),
  comment: commentsPerPhoto,
});

const photoDescription = Array.from(
  { length: NUMBER_OF_GENERATED_DESCRIPTIONS },
  createPhotoDescription,
);
>>>>>>> Stashed changes
