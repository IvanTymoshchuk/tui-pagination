import {UnsplashAPI} from './UnsplashAPI'
import  createGalleryCards from '../templates/gallery-cards.hbs';

const ulEl = document.querySelector('.js-gallery');

const unsplashApi = new UnsplashAPI;

async function onRenderPage(page){
try{
  const respons = await unsplashApi.getPopularPhotos(page);

  ulEl.innerHTML = createGalleryCards(respons.data.results);
  console.log(respons.data.results);
}catch(err){
  console.log(err);
}
}
onRenderPage();

