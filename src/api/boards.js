import api from './axios';

export const getBoards = () => api.get('/boards').then((res) => res.data);

export const createBoard = (title, description) =>
  api.post('/boards', { title, description }).then((res) => res.data);
