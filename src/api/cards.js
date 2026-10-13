import api from './axios';

export const getCards = () => api.get('/cards').then((res) => res.data);

export const createCard = (payload) => api.post('/cards', payload).then((res) => res.data);

export const updateCardStatus = (id, status) =>
  api.put(`/cards/${id}`, { status }).then((res) => res.data);

export const getProgress = () => api.get('/cards/progress/all').then((res) => res.data);