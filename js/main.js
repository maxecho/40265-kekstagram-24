// Вспомогательные функции ил прошлого задания
function getRandomPositiveInteger(numberA, numberB) {
  const lower = Math.ceil(Math.min(Math.abs(numberA), Math.abs(numberB)));
  const upper = Math.floor(Math.max(Math.abs(numberA), Math.abs(numberB)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

// Функция чтобы вытаскивать случайный элемент из массива
const getRandomArrayElement = (elements) => elements[_.random(0, elements.length - 1)];

const NUMBER_OF_GENERATED_DESCRIPTIONS = 25;
const NUMBER_OF_COMMENTS_PER_PHOTO = 2;
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

let idCounter = 1;

const generateComments = (id, avatar, message, name) => ({
  id,
  avatar: `img/avatar-${  getRandomPositiveInteger(0, 6)  }.svg`,
  message: getRandomArrayElement(MESSEGE),
  name: getRandomArrayElement(NAMES),
});

const commentsPerPhoto = [];

for(let i = 0; i < NUMBER_OF_COMMENTS_PER_PHOTO; i++) {
  const newComment = generateComments(
    idCounter
  );
  commentsPerPhoto.push(newComment);
  idCounter++;
}

const generatePhotoDescription = (id, url, description, likes, comment) => ({
  id,
  url: `photos/${  getRandomPositiveInteger(1, 25)  }.jpg`,
  description: 'Фотография с тонной коррекции и подписью',
  likes: getRandomPositiveInteger(15, 200),
  comment: commentsPerPhoto,
})

const photoDescription = [];

for(let i = 0; i < NUMBER_OF_GENERATED_DESCRIPTIONS; i++) {
  const newDescription = generatePhotoDescription(
    idCounter
  );
  photoDescription.push(newDescription);
  idCounter++;
}
