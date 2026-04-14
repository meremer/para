import React, { useState } from 'react';
import { auth } from '../services/api';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    setYukleniyor(true);

    try {
      const response = await auth.girisYap(kullaniciAdi, sifre);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('kullanici', JSON.stringify(response.data.kullanici));
      onLogin(response.data.kullanici);
    } catch (error) {
      setHata(error.response?.data?.hata || 'Giriş başarısız');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Endex</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              value={kullaniciAdi}
              onChange={(e) => setKullaniciAdi(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              required
            />
          </div>
          {hata && <div className="error-message">{hata}</div>}
          <button type="submit" disabled={yukleniyor}>
            {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        <div className="demo-accounts">
          <h3>Demo Hesaplar (Şifre: demo123)</h3>
          <ul>
            <li>admin - Yönetici</li>
            <li>kantinci - Kantinci</li>
            <li>argeta, enart, ekg, ensac, entech - Kulüpler</li>
            <li>ogrenci - Öğrenci</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
