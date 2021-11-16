import { isEscapeKey } from './utils.js';

const STEP_OPEN_COMMENTS = 5;
const bigPicture = document.querySelector('.big-picture ');
const bigPictureImg = document.querySelector('.big-picture__img').querySelector('img');
const likesCount = document.querySelector('.likes-count');
const socialCaption = document.querySelector('.social__caption');
const pictureCancel = document.querySelector('#picture-cancel');
const socialCommentCount = document.querySelector('.social__comment-count');
const socialComments = document.querySelector('.social__comments');
const commentsLoader = document.querySelector('.social__comments-loader');
const socialCommentTemplate = document.querySelector('#social-comment').content.querySelector('.social__comment');

//Зачистка комментариев
const removeFullScreenPicture = () => {
  while (socialComments.firstChild) {
    socialComments.removeChild(socialComments.firstChild);
  }
};

//Функция отрисовки полноэкранного изображения
const renderFullScreenPicture = (picture) => {
  document.body.classList.add('modal-open');
  bigPicture.classList.remove('hidden');
  bigPictureImg.src = picture.url;
  likesCount.textContent = picture.likes;
  socialCaption.textContent = picture.description;
  addComments(picture.comments);
};

//Функция для создания комменатриев
const createComment = (comment) => {
  const socialCommentClone = socialCommentTemplate.cloneNode(true);
  const socialPicture = socialCommentClone.querySelector('.social__picture');
  const socialText = socialCommentClone.querySelector('.social__text');
  socialPicture.src = comment.avatar;
  socialPicture.alt = comment.name;
  socialText.textContent = comment.message;
  return socialCommentClone;
};

//Функция для добавления комменатриев
function addComments(comments) {
  const socialCommentFragment = document.createDocumentFragment();
  const quantityComments = comments.length;
  let commentsIter;
  if (quantityComments > STEP_OPEN_COMMENTS) {
    socialCommentCount.textContent = `${STEP_OPEN_COMMENTS} из ${quantityComments}`;
    commentsLoader.classList.remove('hidden');
    commentsIter = STEP_OPEN_COMMENTS;
  } else {
    socialCommentCount.textContent = `${quantityComments} из ${quantityComments}`;
    commentsLoader.classList.add('hidden');
    commentsIter = quantityComments;
  }
  for (let i = 0; i < commentsIter; i++) {
    socialCommentFragment.appendChild(createComment(comments[i]));
  }
  const onLoadAddCommentsClick = function () {
    const quantityOpenComments = socialComments.children.length;
    let openComments;
    if (quantityComments <= quantityOpenComments + STEP_OPEN_COMMENTS) {
      openComments = quantityComments;
      commentsLoader.classList.add('hidden');
    } else {
      openComments = quantityOpenComments + STEP_OPEN_COMMENTS;
    }
    for (let i = quantityOpenComments; i < openComments; i++) {
      socialCommentFragment.appendChild(createComment(comments[i]));
    }
    socialComments.appendChild(socialCommentFragment);
    socialCommentCount.textContent = `${openComments} из ${quantityComments}`;
  };
  const onClosedScreenESC = (evt) => {
    const fullScreenPhoto = document.querySelector('.big-picture').classList.contains('hidden');
    if (isEscapeKey(evt) && !fullScreenPhoto) {
      commentsLoader.removeEventListener('click', onLoadAddCommentsClick);
      document.removeEventListener('keydown', onClosedScreenESC);
      closedFullScreen();
    }
  };
  commentsLoader.addEventListener('click', onLoadAddCommentsClick);
  pictureCancel.addEventListener('click', () => {
    commentsLoader.removeEventListener('click', onLoadAddCommentsClick);
    document.removeEventListener('keydown', onClosedScreenESC);
    closedFullScreen();
  }, { once: true });
  document.addEventListener('keydown', onClosedScreenESC);
  socialComments.appendChild(socialCommentFragment);
}
//Функция отловки закрытия по ESC
const onClosedFullScreenESC = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closedFullScreen();
  }
};

//Функция закрытия полноэкранного изображения
function closedFullScreen() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  removeFullScreenPicture();
  document.removeEventListener('keydown', onClosedFullScreenESC);
}

//Обработчик открытия изображения по клику
const openFullScreenPicture = (pictures, othersUsersPictures) => {
  pictures.forEach((value, index) => {
    value.addEventListener('click', (evt) => {
      evt.preventDefault();
      renderFullScreenPicture(othersUsersPictures[index]);
    });
  });
};

export { openFullScreenPicture };
