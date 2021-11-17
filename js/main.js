import { getData } from './backend.js';
import { workFilter, showErrorMessageFromGetData } from './rendering-thumbnails.js';
import { importFiles } from './import.js';

getData(
  (data) => workFilter(data),
  () => showErrorMessageFromGetData(),
);

importFiles();
