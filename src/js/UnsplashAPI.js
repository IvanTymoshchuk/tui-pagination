// https://unsplash.com/documentation#get-a-photo - посилання на сторінку
//https: www.npmjs.com/package/tui-pagination - пагінація
import axios from 'axios';
export class UnsplashAPI {
  // Приватні властивості
  #BASE_URL = 'https://api.unsplash.com';
  #API_KEY = 'LxvKVGJqiSe6NcEVZOaLXC-f2JIIWZaq_o0WrF8mwJc';
  #query = '';

  getPopularPhotos(page) {
    return axios.get(`${this.#BASE_URL}/search/photos`, {
      params: {
        query: 'random',
        page,
        per_page: 12,
        client_id: this.#API_KEY,
      },
    });
  }
}
