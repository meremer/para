import axios from 'axios';

// Use relative URL for production, localhost for development
const API_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  girisYap: (kullanici_adi, sifre) =>
    api.post('/auth/giris', { kullanici_adi, sifre }),
  cikisYap: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('kullanici');
  }
};

export const admin = {
  kulupleriListele: () => api.get('/admin/kulupler'),
  kulupPuanGuncelle: (kulup_id, puan, islem) =>
    api.post('/admin/kulup/puan', { kulup_id, puan, islem }),
  kulupBilgiGuncelle: (data) => api.put('/admin/kulup/bilgi', data),
  kulupParaVer: (kulup_id, miktar) =>
    api.post('/admin/kulup/para', { kulup_id, miktar }),
  ogrenciOlustur: (kullanici_adi, sifre) =>
    api.post('/admin/ogrenci', { kullanici_adi, sifre })
};

export const kulup = {
  bakiyeGoruntule: () => api.get('/kulup/bakiye'),
  ogrencileriListele: () => api.get('/kulup/ogrenciler'),
  ogrenciyeParaVer: (ogrenci_id, miktar) =>
    api.post('/kulup/para-ver', { ogrenci_id, miktar })
};

export const ogrenci = {
  cuzdanGoruntule: () => api.get('/ogrenci/cuzdan')
};

export const kantinci = {
  ogrenciAra: (kullanici_adi) =>
    api.get('/kantinci/ogrenci-ara', { params: { kullanici_adi } }),
  odemeYap: (ogrenci_id, kulup_id, tutar) =>
    api.post('/kantinci/odeme', { ogrenci_id, kulup_id, tutar })
};

export default api;
