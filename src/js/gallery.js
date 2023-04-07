import { UnsplashAPI } from './UnsplashAPI';
import createGalleryCards from '../templates/gallery-cards.hbs';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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
const lightbox = new SimpleLightbox('.gallery a');

async function onRenderPage(page) {

  try {
    const respons = await unsplashApi.getPopularPhotos(page);
    lightbox.refresh();
    ulEl.innerHTML = createGalleryCards(respons.data.results);
    
    pagination.reset(respons.data.total);
    

    // Якщо все добре, додаємо пагінацію
    container.classList.remove('is-hidden');

  } catch (err) {
    console.log(err);
  }
  
}
// Метод для відображення на яку кнопку натиснули. Подальша підгрузка данних за допомгою пагінації
const createPopularPagination = async event => {
  try {
    const currentPage = event.page;
    // Робимо подальші запити
    const respons = await unsplashApi.getPopularPhotos(currentPage);

    // Після відповіді відмальовуємо розмітку
    ulEl.innerHTML = createGalleryCards(respons.data.results);
    // lightbox.refresh();
  } catch (err) {
    console.log(err);
  }
};

// Додаємо слухача на пагінацію
pagination.on('afterMove', createPopularPagination);

onRenderPage();

//* 2 частина запиту картинок по ключовому слову
const searchFormEl = document.querySelector('.js-search-form');

searchFormEl.addEventListener('submit', onSearchFormSubmit);

const createPhotosByQueryPagination = async event => {
  try {
    const currentPage = event.page;

    // Робимо подальші запити
    const response = await unsplashApi.fetchPhotosByQuery(currentPage);

    // Після відповіді відмальовуємо розмітку
    ulEl.innerHTML = createGalleryCards(response.data.results);
    // lightbox.refresh();
  } catch (err) {
    console.log(err);
  }
};

async function onSearchFormSubmit(e) {
  e.preventDefault();

  // Відписуємось від попередніх пагінацій
  pagination.off('afterMove', createPopularPagination);
  pagination.off('afterMove', createPhotosByQueryPagination);

  const searchQuery =
    e.currentTarget.elements['user-search-query'].value.trim();

  unsplashApi.query = searchQuery;

  if (!searchQuery) {
    return alert('пустий запит');
  }

  try {
    const respons = await unsplashApi.fetchPhotosByQuery(page);
    if (respons.data.results.length === 0) {
      container.classList.add('is-hidden');
      searchFormEl.reset();
      ulEl.innerHTML = '';
      return alert('Вибачте, по вашому запису нічого не знайдено ');
    }

    if (respons.data.results.length < options.itemsPerPage) {
      container.classList.add('is-hidden');
      ulEl.innerHTML = createGalleryCards(respons.data.results);
      return;
    }
    // lightbox.refresh();
    ulEl.innerHTML = createGalleryCards(respons.data.results);
    pagination.reset(respons.data.total);
    // Робимо підписку на нову пагінацію, для подальших запросів
    pagination.on('afterMove', createPhotosByQueryPagination);
  } catch (err) {
    console.log(err);
  }
}
