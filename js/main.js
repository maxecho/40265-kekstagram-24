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

// Вспомогательные функции из прошлого задания
function getRandomPositiveInteger(numberA, numberB) {
  const lower = Math.ceil(Math.min(Math.abs(numberA), Math.abs(numberB)));
  const upper = Math.floor(Math.max(Math.abs(numberA), Math.abs(numberB)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}
// Функция чтобы вытаскивать случайный элемент из массива
const getRandomArrayElement = (elements) => elements[_.random(0, elements.length - 1)];

const commentsIdsSet = new Set();
const commentsIdsNumber = NUMBER_OF_COMMENTS_PER_PHOTO * NUMBER_OF_GENERATED_DESCRIPTIONS;
while(commentsIdsSet.size !== commentsIdsNumber) {
  commentsIdsSet.add(getRandomPositiveInteger(1,commentsIdsNumber*2));
}
const commentsIds = Array.from(commentsIdsSet);

const generateComments = () => ({
  id: commentsIds.pop(),
  avatar: `img/avatar-${  getRandomPositiveInteger(0, 6)  }.svg`,
  message: getRandomArrayElement(MESSEGE),
  name: getRandomArrayElement(NAMES),
});

const createPhotoDescription = (__, id) => ({
  id,
  url: `photos/${id}.jpg`,
  description: 'Фотография с тонной коррекции и подписью',
  likes: getRandomPositiveInteger(15, 200),
  comment: Array.from(
    {length: NUMBER_OF_COMMENTS_PER_PHOTO },
    generateComments,
  ),
});

const photoDescription = Array.from(
  {length: NUMBER_OF_GENERATED_DESCRIPTIONS },
  createPhotoDescription,
);

