import React, { useState, useEffect } from 'react';
import { ogrenci } from '../services/api';
import '../styles/Ogrenci.css';

const OgrenciDashboard = () => {
  const [cuzdan, setCuzdan] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [mesaj, setMesaj] = useState('');

  useEffect(() => {
    cuzdanYukle();
  }, []);

  const cuzdanYukle = async () => {
    try {
      const response = await ogrenci.cuzdanGoruntule();
      setCuzdan(response.data);
    } catch (error) {
      setMesaj('Cüzdan yüklenemedi: ' + (error.response?.data?.hata || error.message));
    } finally {
      setYukleniyor(false);
    }
  };

  if (yukleniyor) return <div className="loading">Yükleniyor...</div>;

  const toplamDeger = cuzdan.reduce((toplam, item) => toplam + parseFloat(item.toplam_deger), 0);

  return (
    <div className="ogrenci-dashboard">
      <h1>Cüzdanım</h1>

      {mesaj && <div className="message">{mesaj}</div>}

      <div className="total-value">
        <h2>Toplam Değer: {toplamDeger.toFixed(2)}</h2>
      </div>

      <div className="wallet-grid">
        {cuzdan.length === 0 ? (
          <p className="empty-wallet">Cüzdanınızda para birimi bulunmuyor</p>
        ) : (
          cuzdan.map((item, index) => (
            <div key={index} className="currency-card">
              <h3>{item.kulup_isim}</h3>
              <div className="currency-info">
                <p><strong>Para Birimi:</strong> {item.para_birimi_isim}</p>
                <p><strong>Miktar:</strong> {item.miktar}</p>
                <p><strong>Birim Değer:</strong> {item.birim_deger}</p>
                <p className="total"><strong>Toplam Değer:</strong> {item.toplam_deger}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OgrenciDashboard;
