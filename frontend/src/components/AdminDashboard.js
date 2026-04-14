import React, { useState, useEffect } from 'react';
import { admin } from '../services/api';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const [kulupler, setKulupler] = useState([]);
  const [secilenKulup, setSecilenKulup] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [mesaj, setMesaj] = useState('');

  // Form state'leri
  const [puanMiktar, setPuanMiktar] = useState('');
  const [paraMiktar, setParaMiktar] = useState('');
  const [yeniOgrenci, setYeniOgrenci] = useState({ kullanici_adi: '', sifre: '' });
  const [kulupBilgi, setKulupBilgi] = useState({
    para_birimi_isim: '',
    baz_deger: '',
    formul_esik: '',
    formul_artis: '',
    formul_aralik: ''
  });

  useEffect(() => {
    kulupleriYukle();
  }, []);

  const kulupleriYukle = async () => {
    try {
      const response = await admin.kulupleriListele();
      setKulupler(response.data);
    } catch (error) {
      setMesaj('Kulüpler yüklenemedi: ' + (error.response?.data?.hata || error.message));
    } finally {
      setYukleniyor(false);
    }
  };

  const puanGuncelle = async (islem) => {
    if (!secilenKulup || !puanMiktar) return;

    try {
      await admin.kulupPuanGuncelle(secilenKulup.id, parseInt(puanMiktar), islem);
      setMesaj(`${secilenKulup.isim} kulübüne ${puanMiktar} puan ${islem === 'ekle' ? 'eklendi' : 'çıkarıldı'}`);
      setPuanMiktar('');
      kulupleriYukle();
    } catch (error) {
      setMesaj('Hata: ' + (error.response?.data?.hata || error.message));
    }
  };

  const paraVer = async () => {
    if (!secilenKulup || !paraMiktar) return;

    try {
      await admin.kulupParaVer(secilenKulup.id, parseFloat(paraMiktar));
      setMesaj(`${secilenKulup.isim} kulübüne ${paraMiktar} ${secilenKulup.para_birimi_isim} verildi`);
      setParaMiktar('');
      kulupleriYukle();
    } catch (error) {
      setMesaj('Hata: ' + (error.response?.data?.hata || error.message));
    }
  };

  const kulupBilgiGuncelle = async () => {
    if (!secilenKulup) return;

    const data = { kulup_id: secilenKulup.id };
    if (kulupBilgi.para_birimi_isim) data.para_birimi_isim = kulupBilgi.para_birimi_isim;
    if (kulupBilgi.baz_deger) data.baz_deger = parseFloat(kulupBilgi.baz_deger);
    if (kulupBilgi.formul_esik) data.formul_esik = parseInt(kulupBilgi.formul_esik);
    if (kulupBilgi.formul_artis) data.formul_artis = parseFloat(kulupBilgi.formul_artis);
    if (kulupBilgi.formul_aralik) data.formul_aralik = parseInt(kulupBilgi.formul_aralik);

    try {
      await admin.kulupBilgiGuncelle(data);
      setMesaj('Kulüp bilgileri güncellendi');
      setKulupBilgi({ para_birimi_isim: '', baz_deger: '', formul_esik: '', formul_artis: '', formul_aralik: '' });
      kulupleriYukle();
    } catch (error) {
      setMesaj('Hata: ' + (error.response?.data?.hata || error.message));
    }
  };

  const ogrenciOlustur = async () => {
    if (!yeniOgrenci.kullanici_adi || !yeniOgrenci.sifre) return;

    try {
      await admin.ogrenciOlustur(yeniOgrenci.kullanici_adi, yeniOgrenci.sifre);
      setMesaj(`Öğrenci ${yeniOgrenci.kullanici_adi} oluşturuldu`);
      setYeniOgrenci({ kullanici_adi: '', sifre: '' });
    } catch (error) {
      setMesaj('Hata: ' + (error.response?.data?.hata || error.message));
    }
  };

  if (yukleniyor) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Yönetici Paneli</h1>

      {mesaj && <div className="message">{mesaj}</div>}

      <div className="dashboard-grid">
        <div className="section">
          <h2>Kulüpler</h2>
          <div className="club-list">
            {kulupler.map(kulup => (
              <div
                key={kulup.id}
                className={`club-card ${secilenKulup?.id === kulup.id ? 'selected' : ''}`}
                onClick={() => setSecilenKulup(kulup)}
              >
                <h3>{kulup.isim}</h3>
                <p>Puan: {kulup.puan}</p>
                <p>Para Birimi: {kulup.para_birimi_isim}</p>
                <p>Birim Değer: {kulup.para_degeri}</p>
                <p>Bakiye: {kulup.para_bakiye}</p>
              </div>
            ))}
          </div>
        </div>

        {secilenKulup && (
          <>
            <div className="section">
              <h2>Puan Yönetimi - {secilenKulup.isim}</h2>
              <input
                type="number"
                placeholder="Puan miktarı"
                value={puanMiktar}
                onChange={(e) => setPuanMiktar(e.target.value)}
              />
              <div className="button-group">
                <button onClick={() => puanGuncelle('ekle')}>Puan Ekle</button>
                <button onClick={() => puanGuncelle('cikar')}>Puan Çıkar</button>
              </div>
            </div>

            <div className="section">
              <h2>Para Birimi Ver - {secilenKulup.isim}</h2>
              <input
                type="number"
                placeholder="Para miktarı"
                value={paraMiktar}
                onChange={(e) => setParaMiktar(e.target.value)}
              />
              <button onClick={paraVer}>Para Ver</button>
            </div>

            <div className="section">
              <h2>Kulüp Ayarları - {secilenKulup.isim}</h2>
              <input
                type="text"
                placeholder="Para birimi ismi"
                value={kulupBilgi.para_birimi_isim}
                onChange={(e) => setKulupBilgi({...kulupBilgi, para_birimi_isim: e.target.value})}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Baz değer"
                value={kulupBilgi.baz_deger}
                onChange={(e) => setKulupBilgi({...kulupBilgi, baz_deger: e.target.value})}
              />
              <input
                type="number"
                placeholder="Formül eşik (örn: 100)"
                value={kulupBilgi.formul_esik}
                onChange={(e) => setKulupBilgi({...kulupBilgi, formul_esik: e.target.value})}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Formül artış (örn: 0.1)"
                value={kulupBilgi.formul_artis}
                onChange={(e) => setKulupBilgi({...kulupBilgi, formul_artis: e.target.value})}
              />
              <input
                type="number"
                placeholder="Formül aralık (örn: 100)"
                value={kulupBilgi.formul_aralik}
                onChange={(e) => setKulupBilgi({...kulupBilgi, formul_aralik: e.target.value})}
              />
              <button onClick={kulupBilgiGuncelle}>Güncelle</button>
            </div>
          </>
        )}

        <div className="section">
          <h2>Yeni Öğrenci Oluştur</h2>
          <input
            type="text"
            placeholder="Kullanıcı adı"
            value={yeniOgrenci.kullanici_adi}
            onChange={(e) => setYeniOgrenci({...yeniOgrenci, kullanici_adi: e.target.value})}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={yeniOgrenci.sifre}
            onChange={(e) => setYeniOgrenci({...yeniOgrenci, sifre: e.target.value})}
          />
          <button onClick={ogrenciOlustur}>Öğrenci Oluştur</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
