import { getData } from './back-end.js';
import { workFilter, showErrorMessageFromGetData } from './rendering-thumbnails.js';
import { importFiles } from './import-file.js';

getData(
  (data) => workFilter(data),
  () => showErrorMessageFromGetData(),
);

importFiles();
