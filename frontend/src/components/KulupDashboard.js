import React, { useState, useEffect } from 'react';
import { kulup } from '../services/api';
import '../styles/Kulup.css';

const KulupDashboard = () => {
  const [bakiye, setBakiye] = useState(null);
  const [ogrenciler, setOgrenciler] = useState([]);
  const [secilenOgrenci, setSecilenOgrenci] = useState('');
  const [miktar, setMiktar] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    verileriYukle();
  }, []);

  const verileriYukle = async () => {
    try {
      const [bakiyeRes, ogrencilerRes] = await Promise.all([
        kulup.bakiyeGoruntule(),
        kulup.ogrencileriListele()
      ]);
      setBakiye(bakiyeRes.data);
      setOgrenciler(ogrencilerRes.data);
    } catch (error) {
      setMesaj('Veriler yüklenemedi: ' + (error.response?.data?.hata || error.message));
    } finally {
      setYukleniyor(false);
    }
  };

  const paraVer = async () => {
    if (!secilenOgrenci || !miktar) {
      setMesaj('Lütfen öğrenci ve miktar seçin');
      return;
    }

    try {
      await kulup.ogrenciyeParaVer(parseInt(secilenOgrenci), parseFloat(miktar));
      setMesaj(`${miktar} ${bakiye.para_birimi_isim} başarıyla verildi`);
      setMiktar('');
      setSecilenOgrenci('');
      verileriYukle();
    } catch (error) {
      setMesaj('Hata: ' + (error.response?.data?.hata || error.message));
    }
  };

  if (yukleniyor) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="kulup-dashboard">
      <h1>{bakiye?.isim} Kulübü</h1>

      {mesaj && <div className="message">{mesaj}</div>}

      <div className="dashboard-grid">
        <div className="section">
          <h2>Kulüp Bilgileri</h2>
          <div className="info-card">
            <p><strong>Puan:</strong> {bakiye?.puan}</p>
            <p><strong>Para Birimi:</strong> {bakiye?.para_birimi_isim}</p>
            <p><strong>Birim Değer:</strong> {bakiye?.para_degeri}</p>
            <p><strong>Bakiye:</strong> {bakiye?.para_bakiye} {bakiye?.para_birimi_isim}</p>
          </div>
        </div>

        <div className="section">
          <h2>Öğrenciye Para Ver</h2>
          <select
            value={secilenOgrenci}
            onChange={(e) => setSecilenOgrenci(e.target.value)}
          >
            <option value="">Öğrenci Seçin</option>
            {ogrenciler.map(ogrenci => (
              <option key={ogrenci.id} value={ogrenci.id}>
                {ogrenci.kullanici_adi}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Miktar"
            value={miktar}
            onChange={(e) => setMiktar(e.target.value)}
          />
          <button onClick={paraVer}>Para Ver</button>
        </div>

        <div className="section">
          <h2>Öğrenci Listesi</h2>
          <div className="student-list">
            {ogrenciler.map(ogrenci => (
              <div key={ogrenci.id} className="student-item">
                {ogrenci.kullanici_adi}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KulupDashboard;
