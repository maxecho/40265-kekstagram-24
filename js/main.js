import { getData } from './backend.js';
import { setupFilters, showErrorMessageFromGetData } from './rendering-thumbnails.js';
import { importFiles } from './import.js';

getData(
  (data) => setupFilters(data),
  () => showErrorMessageFromGetData(),
);

importFiles();
