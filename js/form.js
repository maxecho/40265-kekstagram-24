import { isEscapeKey, createNoUiSlider } from './utils.js';
import { sendData } from './backend.js';

const STEP = 25;
const MAX_SCALE = 100;
const MIN_SCALE = 25;
const BORDER_ERROR = '#ff0000';
const SCALE_MULTIPLIER = 100;

const Effect = {
  none: {
    name: 'effect-none',
  },
  chrome: {
    name: 'effect-chrome',
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    set: 0,
    filter: 'grayscale',
    unit: '',
  },
  sepia: {
    name: 'effect-sepia',
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    set: 0,
    filter: 'sepia',
    unit: '',
  },
  marvin: {
    name: 'effect-marvin',
    min: 0,
    max: 100,
    start: 100,
    step: 1,
    set: 0,
    filter: 'invert',
    unit: '%',
  },
  phobos: {
    name: 'effect-phobos',
    min: 0,
    max: 3,
    start: 3,
    step: 0.1,
    set: 0,
    filter: 'blur',
    unit: 'px',
  },
  heat: {
    name: 'effect-heat',
    min: 1,
    max: 3,
    start: 3,
    step: 0.1,
    set: 1,
    filter: 'brightness',
    unit: '',
  },
};

const bodyTag = document.querySelector('body');
const mainTag = document.querySelector('main');
const formImageUpload = document.querySelector('#upload-select-image');
const modalPhotoModification = document.querySelector('.img-upload__overlay');
const photoPreview = modalPhotoModification.querySelector('.img-upload__preview img');
const photoPreviewContainer = modalPhotoModification.querySelector('.img-upload__preview');
const closeButton = modalPhotoModification.querySelector('#upload-cancel');
const scaleControl = modalPhotoModification.querySelector('.scale');
const scaleValue = scaleControl.querySelector('.scale__control--value');
const scaleMinus = scaleControl.querySelector('.scale__control--smaller');
const scalePlus = scaleControl.querySelector('.scale__control--bigger');
const sliderElement = document.querySelector('#slider');
const sliderValue = document.querySelector('.effect-level__value');
const effectsRadio = document.querySelectorAll('.effects__radio');
const effectLevel = document.querySelector('.effect-level');
const uploadEffectsFieldset = document.querySelector('.img-upload__effects');
const hashtagInput = modalPhotoModification.querySelector('.text__hashtags');
const commentInput = modalPhotoModification.querySelector('.text__description');
let isValid = true;
let currentValue = MAX_SCALE;

//В задании сказано поставить 100% — ставим
const setDefaultScale = () => {
  scaleValue.value = `${MAX_SCALE}%`;
  photoPreview.style.transform = 'scale(1)';
};

//Увеличение масштаба
const setCustomScale = () => {
  scaleValue.value = `${currentValue}%`;
  photoPreview.style.transform = `scale(${currentValue / SCALE_MULTIPLIER})`;
};

const onChangeScale = (evt) => {
  if (evt.target === scalePlus && currentValue < MAX_SCALE) {
    currentValue += STEP;
    setCustomScale();
  } else if (evt.target === scaleMinus && currentValue > MIN_SCALE) {
    currentValue -= STEP;
    setCustomScale();
  }
};

//Смена масштаба
const changeScale = () => {
  scaleControl.addEventListener('click', onChangeScale);
};

//Слайдер
createNoUiSlider(sliderElement);

const removeCurrentEffect = () => {
  for (let i = 0; i < photoPreviewContainer.classList.length; i++) {
    if (photoPreviewContainer.classList[i].indexOf('effects__preview--') === 0) {
      photoPreviewContainer.classList.remove(photoPreviewContainer.classList[i]);
      break;
    }
  }
  sliderValue.value = '';
  photoPreviewContainer.style = '';
};

//Эффект по умолчанию
const setDefaultEffect = () => {
  document.querySelector(`#${Effect.none.name}`).checked = true;
  effectLevel.classList.add('hidden');
  removeCurrentEffect();
};


//Колбек обработчика
const onChangeEffectClick = (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }
  const effectName = evt.target.id.replace('effect-', '');
  const {
    name, unit, min, max,
    start, step, set, filter,
  } = Effect[effectName];

  if (name === Effect.none.name) {
    setDefaultEffect();
    return;
  }

  effectLevel.classList.remove('hidden');
  removeCurrentEffect();
  photoPreviewContainer.classList.add(`effects__preview--${effectName}`);

  sliderElement.noUiSlider.reset();
  sliderElement.noUiSlider.set(set);
  sliderElement.noUiSlider.updateOptions({
    start: [start],
    step: step,
    range: {
      min: min,
      max: max,
    },
  }, true);
  sliderElement.noUiSlider.on('update', (values, handle) => {
    sliderValue.value = values[handle];
    photoPreviewContainer.style.filter = `${filter}(${values[handle]}${unit})`;
  });
};

//Управление эффектами
const changeEffect = () => {
  uploadEffectsFieldset.addEventListener('click', onChangeEffectClick);
};

//Проверяем ввод тегов
const checkSpace = (checkValue) => checkValue !== '';

const onHashtagKeydown = () => {
  removeValidHandler();
};

const onHashtagInput = () => {
  validateHashtag();
};

const onHashtagBlur = () => {
  addInvalidHandler();
};

//Валидатор тегов
const validateHashtag = () => {
  const hashtagInputValue = hashtagInput.value;
  const hashtags = hashtagInputValue.trim().toLowerCase().split(' ').filter(checkSpace);
  const removeSymbol = /[^a-zA-Zа-яА-Я0-9ё#]/g;

  //Проверка одинаковых хештегов с разным регистром
  const checkUpLowCase = (i) => {
    let checkCase;
    for (let j = 0; j < hashtags.length; j++) {
      if (hashtags[i] === hashtags[j] && j !== i) {
        checkCase = true;
      }
    }
    return checkCase;
  };

  //Проверка условий валидности хештегов
  const checkDoubleHashtag = (i) => {
    let checkHash;
    for (let j = 1; j < hashtags[i].length; j++) {
      if (hashtags[i][j] === '#') {
        checkHash = true;
      }
    }
    return checkHash;
  };
  for (let i = 0; i < hashtags.length; i++) {
    if (hashtags[i][0] !== '#') {
      hashtagInput.setCustomValidity('#ХЕШТЕГ должен начинаться с решётки => #)');
      isValid = false;
    } else if (hashtags[i].search(removeSymbol) > 0) {
      hashtagInput.setCustomValidity('После решётки/диеза => #, #ХЕШТЕГ должен состоять только из букв и чисел');
      isValid = false;
    } else if (checkDoubleHashtag(i)) {
      hashtagInput.setCustomValidity('Может быть использована только одна решётка/диез => #');
      isValid = false;
    } else if (hashtags[i].length <= 1) {
      hashtagInput.setCustomValidity('#ХЕШТЕГ не может состоять из одного символа');
      isValid = false;
    } else if (hashtags[i].length > 20) {
      hashtagInput.setCustomValidity('#ХЕШТЕГ не может быть длинее 20 символов');
      isValid = false;
    } else if (checkUpLowCase(i)) {
      hashtagInput.setCustomValidity('Один и тот же #ХЕШТЕГ не может быть использован дважды без учёта регистра: #ХЕШТЕГ и #хештег считаются одним и тем же тегом');
      isValid = false;
    } else if (hashtags.length > 5) {
      hashtagInput.setCustomValidity('Использование более пяти #ХЕШТЕГОВ недопустимо');
      isValid = false;
    } else {
      hashtagInput.setCustomValidity('');
      isValid = true;
    }
  }
};

//Сброс настроек при закрытии окна
const setDefaultSettings = () => {
  formImageUpload.reset();
  modalPhotoModification.classList.add('hidden');
  bodyTag.classList.remove('modal-open');
  setDefaultEffect();
  setDefaultScale();
};

//Обводка ошибки
const addInvalidHandler = () => {
  if (!isValid && hashtagInput.value) {
    hashtagInput.style.borderColor = BORDER_ERROR;
  }
};

//Без обводки ошибки
const removeValidHandler = () => {
  hashtagInput.removeAttribute('style');
};

//Закрытие по ESC
const onClosedInputEsc = (evt) => {
  if (isEscapeKey(evt) && evt.target !== hashtagInput && evt.target !== commentInput) {
    //Сброс настроек при закрытии окна
    setDefaultSettings();
    uploadEffectsFieldset.removeEventListener('click', onChangeEffectClick);
    scaleControl.removeEventListener('click', onChangeScale);
  }
};

//Колбэк крестика
const onClosedClick = () => {
  document.removeEventListener('keydown', onClosedInputEsc);
  uploadEffectsFieldset.removeEventListener('click', onChangeEffectClick);
  scaleControl.removeEventListener('click', onChangeScale);
  setDefaultSettings();
};


//Колбэк обработчика удаления сообщения
const removeMessage = () => {
  const successMessage = mainTag.querySelector('.success');
  const errorMessage = mainTag.querySelector('.error');
  if (successMessage) {
    mainTag.removeChild(successMessage);
  }
  if (errorMessage) {
    mainTag.removeChild(errorMessage);
  }
  document.removeEventListener('keydown', onRemoveMessageEsc);
};

const onRemoveMessage = () => {
  removeMessage();
};

//Колбэк обработчика удаления сообщения при ESC
function onRemoveMessageEsc(evt) {
  if (isEscapeKey(evt)) {
    removeMessage();
  }
  document.removeEventListener('click', onRemoveMessage);
  document.removeEventListener('keydown', onClosedInputEsc);
}

//Добавление сообщения об ошибке
const addMessage = (template) => {
  const messageModal = template.cloneNode(true);
  mainTag.appendChild(messageModal);
  document.addEventListener('click', onRemoveMessage);
  document.addEventListener('keydown', onRemoveMessageEsc);
  setDefaultSettings();
};

//Показать ошибку
const showErrorMessage = () => {
  modalPhotoModification.classList.add('hidden');
  const errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
  addMessage(errorMessageTemplate);
};

//Показать успех
const showSuccessMessage = () => {
  modalPhotoModification.classList.add('hidden');
  const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  addMessage(successMessageTemplate);
};


//Колбэк отправки формы
const onFormSubmit = (evt) => {
  evt.preventDefault();
  sendData(showSuccessMessage, showErrorMessage, new FormData(formImageUpload));
  setDefaultSettings();
};

//Общая функция
const attachFormEvents = () => {
  validateHashtag();
  document.addEventListener('keydown', onClosedInputEsc);
  hashtagInput.addEventListener('input', onHashtagInput);
  hashtagInput.addEventListener('blur', onHashtagBlur);
  hashtagInput.addEventListener('keydown', onHashtagKeydown);
  formImageUpload.addEventListener('submit', onFormSubmit);
  closeButton.addEventListener('click', onClosedClick);
};

export { attachFormEvents, setDefaultScale, changeScale, setDefaultEffect, changeEffect };
