import api from './api';

export const authService = {
  register: (username, email, password, passwordConfirm) =>
    api.post('/auth/register', { username, email, password, passwordConfirm }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password })
};

export const cdService = {
  addCD: (title, artist, releaseYear, imdbId, condition, notes) =>
    api.post('/cds/add', { title, artist, releaseYear, imdbId, condition, notes }),
  
  getUserCDs: () =>
    api.get('/cds/my-cds'),
  
  deleteCD: (cdId) =>
    api.delete(`/cds/${cdId}`),
  
  searchCDs: (q) =>
    api.get('/cds/search', { params: { q } })
};

export const borrowService = {
  borrowCD: (cdId, borrowerName, expectedReturnDate) =>
    api.post('/borrows/borrow', { cdId, borrowerName, expectedReturnDate }),
  
  returnCD: (borrowId) =>
    api.put(`/borrows/return/${borrowId}`),
  
  getBorrows: () =>
    api.get('/borrows/my-borrows')
};

export const favoriteService = {
  addFavorite: (imdbId, title, artist, imdbData, favoriteType) =>
    api.post('/favorites/add', { imdbId, title, artist, imdbData, favoriteType }),
  
  getFavorites: () =>
    api.get('/favorites/my-favorites'),
  
  removeFavorite: (favoriteId) =>
    api.delete(`/favorites/${favoriteId}`)
};

export const promptService = {
  addPrompt: (content) =>
    api.post('/prompts/add', { content }),
  
  getAllPrompts: () =>
    api.get('/prompts/all')
};
