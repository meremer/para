import React, { useState } from 'react';
import { kantinci } from '../services/api';
import '../styles/Kantinci.css';

const KantinciDashboard = () => {
  const [aramaMetni, setAramaMetni] = useState('');
  const [ogrenciler, setOgrenciler] = useState([]);
  const [secilenOgrenci, setSecilenOgrenci] = useState(null);
  const [secilenParaBirimi, setSecilenParaBirimi] = useState(null);
  const [tutar, setTutar] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const ogrenciAra = async () => {
    if (!aramaMetni) return;

    setYukleniyor(true);
    try {
      const response = await kantinci.ogrenciAra(aramaMetni);
      setOgrenciler(response.data);
      if (response.data.length === 0) {
        setMesaj('Öğrenci bulunamadı');
      }
    } catch (error) {
      setMesaj('Arama hatası: ' + (error.response?.data?.hata || error.message));
    } finally {
      setYukleniyor(false);
    }
  };

  const odemeYap = async () => {
    if (!secilenOgrenci || !secilenParaBirimi || !tutar) {
      setMesaj('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const response = await kantinci.odemeYap(
        secilenOgrenci.id,
        secilenParaBirimi.kulup_id,
        parseFloat(tutar)
      );
      setMesaj(`Ödeme başarılı! ${response.data.harcanan_miktar} ${response.data.para_birimi} harcandı`);
      setTutar('');
      setSecilenParaBirimi(null);
      // Öğrenciyi yeniden ara
      ogrenciAra();
    } catch (error) {
      setMesaj('Ödeme hatası: ' + (error.response?.data?.hata || error.message));
    }
  };

  const hesapla = () => {
    if (!secilenParaBirimi || !tutar) return null;
    const gerekliMiktar = parseFloat(tutar) / parseFloat(secilenParaBirimi.birim_deger);
    return gerekliMiktar.toFixed(2);
  };

  return (
    <div className="kantinci-dashboard">
      <h1>Kantinci Paneli</h1>

      {mesaj && <div className="message">{mesaj}</div>}

      <div className="dashboard-grid">
        <div className="section">
          <h2>Öğrenci Ara</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Öğrenci kullanıcı adı"
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && ogrenciAra()}
            />
            <button onClick={ogrenciAra} disabled={yukleniyor}>
              {yukleniyor ? 'Aranıyor...' : 'Ara'}
            </button>
          </div>

          {ogrenciler.length > 0 && (
            <div className="student-results">
              {ogrenciler.map(ogrenci => (
                <div
                  key={ogrenci.id}
                  className={`student-card ${secilenOgrenci?.id === ogrenci.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSecilenOgrenci(ogrenci);
                    setSecilenParaBirimi(null);
                  }}
                >
                  <h3>{ogrenci.kullanici_adi}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        {secilenOgrenci && (
          <>
            <div className="section">
              <h2>Para Birimleri - {secilenOgrenci.kullanici_adi}</h2>
              <div className="currency-list">
                {secilenOgrenci.para_birimleri
                  .filter(pb => parseFloat(pb.miktar) > 0)
                  .map((paraBirimi, index) => (
                    <div
                      key={index}
                      className={`currency-item ${secilenParaBirimi?.kulup_id === paraBirimi.kulup_id ? 'selected' : ''}`}
                      onClick={() => setSecilenParaBirimi(paraBirimi)}
                    >
                      <h4>{paraBirimi.para_birimi_isim}</h4>
                      <p>Miktar: {parseFloat(paraBirimi.miktar).toFixed(2)}</p>
                      <p>Birim Değer: {parseFloat(paraBirimi.birim_deger).toFixed(2)}</p>
                      <p>Toplam: {(parseFloat(paraBirimi.miktar) * parseFloat(paraBirimi.birim_deger)).toFixed(2)}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="section">
              <h2>Ödeme İşlemi</h2>
              {secilenParaBirimi ? (
                <>
                  <p><strong>Seçilen Para Birimi:</strong> {secilenParaBirimi.para_birimi_isim}</p>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Tutar"
                    value={tutar}
                    onChange={(e) => setTutar(e.target.value)}
                  />
                  {tutar && (
                    <p className="calculation">
                      Gerekli Miktar: {hesapla()} {secilenParaBirimi.para_birimi_isim}
                    </p>
                  )}
                  <button onClick={odemeYap}>Ödeme Yap</button>
                </>
              ) : (
                <p>Lütfen bir para birimi seçin</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KantinciDashboard;
