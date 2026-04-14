const db = require('../config/database');

// Kulübün para bakiyesini görüntüle
const bakiyeGoruntule = async (req, res) => {
  try {
    const kulup_id = req.kullanici.kulup_id;

    const kulup = db.prepare(`
      SELECT k.*, kpb.miktar as para_bakiye
      FROM kulupler k
      LEFT JOIN kulup_para_birimleri kpb ON k.id = kpb.kulup_id
      WHERE k.id = ?
    `).get(kulup_id);

    if (!kulup) {
      return res.status(404).json({ hata: 'Kulüp bulunamadı' });
    }

    let deger = parseFloat(kulup.baz_deger);
    if (kulup.puan > kulup.formul_esik) {
      const fazlaPuan = kulup.puan - kulup.formul_esik;
      const katsayi = Math.floor(fazlaPuan / kulup.formul_aralik);
      deger += katsayi * parseFloat(kulup.formul_artis);
    }

    res.json({ ...kulup, para_degeri: deger.toFixed(2) });
  } catch (error) {
    console.error('Bakiye görüntüleme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

// Öğrenciye para ver
const ogrenciyeParaVer = async (req, res) => {
  try {
    const { ogrenci_id, miktar } = req.body;
    const kulup_id = req.kullanici.kulup_id;

    // Kulübün para bakiyesini kontrol et
    const bakiye = db.prepare('SELECT miktar FROM kulup_para_birimleri WHERE kulup_id = ?').get(kulup_id);

    if (!bakiye || parseFloat(bakiye.miktar) < parseFloat(miktar)) {
      return res.status(400).json({ hata: 'Yetersiz bakiye' });
    }

    // Transaction başlat
    const transaction = db.transaction(() => {
      // Kulübün bakiyesinden düş
      db.prepare('UPDATE kulup_para_birimleri SET miktar = miktar - ? WHERE kulup_id = ?').run(miktar, kulup_id);

      // Öğrencinin cüzdanına ekle
      const existing = db.prepare('SELECT * FROM ogrenci_cuzdanlari WHERE ogrenci_id = ? AND kulup_id = ?').get(ogrenci_id, kulup_id);

      if (existing) {
        db.prepare('UPDATE ogrenci_cuzdanlari SET miktar = miktar + ? WHERE ogrenci_id = ? AND kulup_id = ?').run(miktar, ogrenci_id, kulup_id);
      } else {
        db.prepare('INSERT INTO ogrenci_cuzdanlari (ogrenci_id, kulup_id, miktar) VALUES (?, ?, ?)').run(ogrenci_id, kulup_id, miktar);
      }

      // İşlemi kaydet
      db.prepare(`
        INSERT INTO islemler (tip, gonderen_id, alici_id, kulup_id, miktar, aciklama)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('kulup_ogrenci', req.kullanici.id, ogrenci_id, kulup_id, miktar, 'Kulüp tarafından verildi');
    });

    transaction();

    res.json({ mesaj: 'Para başarıyla verildi' });
  } catch (error) {
    console.error('Para verme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

// Tüm öğrencileri listele
const ogrencileriListele = async (req, res) => {
  try {
    const ogrenciler = db.prepare(`
      SELECT id, kullanici_adi, olusturma_tarihi
      FROM kullanicilar
      WHERE tip = 'ogrenci'
      ORDER BY kullanici_adi
    `).all();

    res.json(ogrenciler);
  } catch (error) {
    console.error('Öğrenci listeleme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

module.exports = {
  bakiyeGoruntule,
  ogrenciyeParaVer,
  ogrencileriListele
};
