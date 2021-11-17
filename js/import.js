import { attachFormEvents, setDefaultScale, changeScale, setDefaultEffect, changeEffect } from './form.js';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const bodyTag = document.querySelector('body');
const uploadFile = bodyTag.querySelector('#upload-file');
const uploadFilePreview = document.querySelector('.img-upload__preview');
const insetFile = bodyTag.querySelector('.img-upload__preview img');
const insertFilesInMiniPreview = bodyTag.querySelectorAll('.effects__preview');
const modalPhotoModification = bodyTag.querySelector('.img-upload__overlay');

//Фнкция импорта файлов
const importFiles = () => {
  const onUploadFileClick = function (evt) {
    evt.preventDefault();
    const file = evt.target.files[0];
    if (file) {
      setDefaultScale();
      changeScale();
      setDefaultEffect();
      changeEffect();
      attachFormEvents();
      const fileName = file.name.toLowerCase();
      const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
      if (matches) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          bodyTag.classList.add('modal-open');
          modalPhotoModification.classList.remove('hidden');
          uploadFilePreview.classList.add('img-upload__preview');
          insetFile.src = reader.result;
          insertFilesInMiniPreview.forEach((imgFile) => {
            imgFile.style.backgroundImage = `url(${reader.result})`;
          });
        });
        reader.addEventListener('error', () => {
          throw new Error('Произошла ошибка загрузки');
        });
        reader.readAsDataURL(file);
      } else {
        throw new Error('Можно использовать только форматы => gif | jpg | jpeg | png');
      }
    }
  };
  uploadFile.addEventListener('change', onUploadFileClick);
};

export { importFiles };
