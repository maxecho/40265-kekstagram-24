import { isEscapeKey, createNoUiSlider } from './utils.js';
import { sendData } from './backend.js';

const STEP = 25;
const MAX_VALUE = 100;
const MIN_VALUE = 25;
const BORDER_ERROR = '#ff0000';
const bodyTag = document.querySelector('body');
const mainTag = document.querySelector('main');
const uploadFile = document.querySelector('#upload-file');
const formImageUpload = document.querySelector('#upload-select-image');
const modalPhotoModification = document.querySelector('.img-upload__overlay');
const photoPreview = modalPhotoModification.querySelector('.img-upload__preview img');
const photoPreviewContainer = modalPhotoModification.querySelector('.img-upload__preview');
const closeButton = modalPhotoModification.querySelector('#upload-cancel');
const scaleControl = modalPhotoModification.querySelector('.scale');
const scaleValue = scaleControl.querySelector('.scale__control--value');
const scaleHiddenValue = scaleControl.querySelector('#scaleHidden');
const scaleMinus = scaleControl.querySelector('.scale__control--smaller');
const scalePlus = scaleControl.querySelector('.scale__control--bigger');
const effectsButtons = modalPhotoModification.querySelectorAll('.effects__radio');
const sliderElement = document.querySelector('#slider');
const sliderValue = document.querySelector('.effect-level__value');
const effectsRadio = document.querySelectorAll('.effects__radio');
const effectLevel = document.querySelector('.effect-level');
const hashtagInput = modalPhotoModification.querySelector('.text__hashtags');
const commentInput = modalPhotoModification.querySelector('.text__description');
let validate = true;
let currentValue = scaleHiddenValue.value * 100;

//В задании сказано поставить 100% — ставим
const setDefaultScale = () => {
  scaleValue.value = '100%';
  scaleHiddenValue.value = 1;
  photoPreviewContainer.style.transform = 'scale(1)';
};

//Увеличение масштаба
const setCustomScale = (step) => {
  scaleValue.value = `${step}%`;
  scaleHiddenValue.value = Number(step / 100);
  photoPreviewContainer.style.transform = `scale(${step / 100})`;
};

//Смена масштаба
const changeScale = () => {
  scaleControl.addEventListener('click', (evt) => {
    if (evt.target === scalePlus && currentValue < MAX_VALUE) {
      setCustomScale(Number(currentValue + STEP));
      currentValue += STEP;
    } else if (evt.target === scaleMinus && currentValue > MIN_VALUE) {
      setCustomScale(Number(currentValue - STEP));
      currentValue -= STEP;
    }
  });
};

//Слайдер
createNoUiSlider(sliderElement);

//Эффект по умолчанию
const defaultEffectImages = () => {
  effectsRadio.forEach((effect) => {
    if (effect.id === 'effect-none') {
      effect.setAttribute('checked', 'checked');
    }
  });
  effectLevel.classList.add('hidden');
  sliderValue.value = '';
  scaleValue.value = '100%';
  scaleHiddenValue.value = 1;
  currentValue = scaleHiddenValue.value * 100;
  photoPreviewContainer.className = '';
  photoPreviewContainer.style = '';
  photoPreviewContainer.classList.add('img-upload__preview');
};

const generateEffect = (effect, min, max, start, step, set, filter, unit) => {
  const toUnit = (unit === undefined) ? '' : unit;
  effectLevel.classList.remove('hidden');
  scaleValue.value = '100%';
  scaleHiddenValue.value = 1;
  currentValue = scaleHiddenValue.value * 100;
  photoPreviewContainer.className = '';
  photoPreviewContainer.style = '';
  sliderValue.value = '';
  photoPreviewContainer.classList.add('img-upload__preview');
  photoPreviewContainer.classList.add(`effects__preview--${effect}`);
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
    photoPreviewContainer.style.filter = `${filter}(${values[handle]}${toUnit})`;
  });
};

//Колбек обработчика
const onChangeEffectClick = (evt) => {
  if (evt.target.id === 'effect-chrome') {
    generateEffect('chrome', 0, 1, 0, 0.1, 0, 'grayscale');
  } else if (evt.target.id === 'effect-sepia') {
    generateEffect('sepia', 0, 1, 0, 0.1, 0, 'sepia');
  } else if (evt.target.id === 'effect-marvin') {
    generateEffect('marvin', 0, 100, 0, 1, 0, 'invert', '%');
  } else if (evt.target.id === 'effect-phobos') {
    generateEffect('phobos', 0, 3, 0, 0.1, 0, 'blur', 'px');
  } else if (evt.target.id === 'effect-heat') {
    generateEffect('heat', 1, 3, 1, 0.1, 1, 'brightness');
  } else {
    defaultEffectImages();
  }
};

//Управление эффектами
const changeEffect = () => {
  effectsRadio.forEach((effect) => {
    effect.addEventListener('click', onChangeEffectClick);
  });
};

//Проверяем ввод тегов
const checkSpace = (checkValue) => checkValue !== '';

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
      validate = false;
    } else if (hashtags[i].search(removeSymbol) > 0) {
      hashtagInput.setCustomValidity('После решётки/диеза => #, #ХЕШТЕГ должен состоять только из букв и чисел');
      validate = false;
    } else if (checkDoubleHashtag(i)) {
      hashtagInput.setCustomValidity('Может быть использована только одна решётка/диез => #');
      validate = false;
    } else if (hashtags[i].length <= 1) {
      hashtagInput.setCustomValidity('#ХЕШТЕГ не может состоять из одного символа');
      validate = false;
    } else if (hashtags[i].length > 20) {
      hashtagInput.setCustomValidity('#ХЕШТЕГ не может быть длинее 20 символов');
      validate = false;
    } else if (checkUpLowCase(i)) {
      hashtagInput.setCustomValidity('Один и тот же #ХЕШТЕГ не может быть использован дважды без учёта регистра: #ХЕШТЕГ и #хештег считаются одним и тем же тегом');
      validate = false;
    } else if (hashtags.length > 5) {
      hashtagInput.setCustomValidity('Использование более пяти #ХЕШТЕГОВ недопустимо');
      validate = false;
    } else {
      hashtagInput.setCustomValidity('');
      validate = true;
    }
  }
};

//Проверка атрибутов перед сбросом на "по умолчанию"
const toggleAttribute = (element, elements, attribute) => {
  if (!element.hasAttribute(attribute)) {
    elements.forEach((effectsButton) => {
      effectsButton.removeAttribute(attribute);
    });
    element.setAttribute(attribute, '');
    element.checked = true;
  }
};

//Сброс настроек при закрытии окна
const setDefaultSettings = () => {
  modalPhotoModification.classList.add('hidden');
  bodyTag.classList.remove('modal-open');
  scaleValue.value = '100%';
  photoPreview.removeAttribute('class');
  photoPreview.removeAttribute('style');
  toggleAttribute(effectsButtons[0], effectsButtons, 'checked');
  uploadFile.value = '';
  hashtagInput.value = '';
  commentInput.value = '';
};

//Обводка ошибки
const addInvalidHandler = () => {
  if (!validate && hashtagInput.value) {
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
    //Удалим лишние обработчики
    effectsRadio.forEach((effect) => {
      effect.removeEventListener('click', onChangeEffectClick);
    });
  }
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
  document.removeEventListener('keydown', onRemoveMessageESC);
};

//Колбэк обработчика удаления сообщения при ESC
function onRemoveMessageESC(evt) {
  if (isEscapeKey(evt)) {
    removeMessage();
  }
  document.removeEventListener('click', removeMessage);
  document.removeEventListener('keydown', onClosedInputEsc);
}

//Добавление сообщения об ошибке
const addMessage = (template) => {
  const messageModal = template.cloneNode(true);
  mainTag.appendChild(messageModal);
  document.addEventListener('click', removeMessage);
  document.removeEventListener('keydown', onRemoveMessageESC);
  document.removeEventListener('keydown', onClosedInputEsc);
  document.addEventListener('keydown', onRemoveMessageESC);
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

//Колбэк крестика
const onClosedClick = () => {
  document.removeEventListener('keydown', onClosedInputEsc);
  effectsRadio.forEach((effect) => {
    effect.removeEventListener('click', onChangeEffectClick);
    document.removeEventListener('keydown', onClosedInputEsc);
  });
  setDefaultSettings();
};

//Общая функция
const workingForm = () => {
  validateHashtag();
  hashtagInput.addEventListener('input', validateHashtag);
  hashtagInput.addEventListener('blur', addInvalidHandler);
  hashtagInput.addEventListener('keydown', removeValidHandler);
  formImageUpload.addEventListener('submit', onFormSubmit);
  document.removeEventListener('click', removeMessage());
  closeButton.addEventListener('click', onClosedClick);
  document.removeEventListener('keydown', onClosedInputEsc);
  document.addEventListener('keydown', onClosedInputEsc);
};

export { workingForm, setDefaultScale, changeScale, defaultEffectImages, changeEffect };
