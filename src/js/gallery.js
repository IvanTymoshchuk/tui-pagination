import { UnsplashAPI } from './UnsplashAPI';
import createGalleryCards from '../templates/gallery-cards.hbs';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

const ulEl = document.querySelector('.js-gallery');
const container = document.getElementById('tui-pagination-container');

const options = {
  // below default value of options
  totalItems: 0,
  itemsPerPage: 12,
  visiblePages: 5,
  page: 1,
};

const unsplashApi = new UnsplashAPI();
const pagination = new Pagination(container, options);
const page = pagination.getCurrentPage();
console.log(page);

async function onRenderPage(page) {
  try {
    const respons = await unsplashApi.getPopularPhotos(page);

    ulEl.innerHTML = createGalleryCards(respons.data.results);
    console.log(respons.data.total);
    pagination.reset(respons.data.total);
  } catch (err) {
    console.log(err);
  }
} // Метод для відображення на яку кнопку натиснули. Подальша підгрузка данних за допомгою пагінації
const createPopularPagination = async event => {
  try {
    const currentPage = event.page;
    console.log(currentPage);
    // Робимо подальші запити
    const respons = await unsplashApi.getPopularPhotos(currentPage);

    // Після відповіді відмальовуємо розмітку
    ulEl.innerHTML = createGalleryCards(respons.data.results);
  } catch (err) {
    console.log(err);
  }
};

// Додаємо слухача на пагінацію
pagination.on('afterMove', createPopularPagination);

onRenderPage();
