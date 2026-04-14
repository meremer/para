const db = require('../config/database');

// Ödeme işlemi yap
const odemeYap = async (req, res) => {
  try {
    const { ogrenci_id, kulup_id, tutar } = req.body;

    // Kulübün para birimi değerini hesapla
    const kulup = db.prepare('SELECT * FROM kulupler WHERE id = ?').get(kulup_id);

    if (!kulup) {
      return res.status(404).json({ hata: 'Kulüp bulunamadı' });
    }

    let deger = parseFloat(kulup.baz_deger);
    if (kulup.puan > kulup.formul_esik) {
      const fazlaPuan = kulup.puan - kulup.formul_esik;
      const katsayi = Math.floor(fazlaPuan / kulup.formul_aralik);
      deger += katsayi * parseFloat(kulup.formul_artis);
    }

    // Gerekli para birimi miktarını hesapla
    const gerekliMiktar = parseFloat(tutar) / deger;

    // Öğrencinin bakiyesini kontrol et
    const bakiye = db.prepare('SELECT miktar FROM ogrenci_cuzdanlari WHERE ogrenci_id = ? AND kulup_id = ?').get(ogrenci_id, kulup_id);

    if (!bakiye || parseFloat(bakiye.miktar) < gerekliMiktar) {
      return res.status(400).json({ hata: 'Yetersiz bakiye' });
    }

    // Transaction başlat
    const transaction = db.transaction(() => {
      // Öğrencinin bakiyesinden düş
      db.prepare('UPDATE ogrenci_cuzdanlari SET miktar = miktar - ? WHERE ogrenci_id = ? AND kulup_id = ?').run(gerekliMiktar, ogrenci_id, kulup_id);

      // İşlemi kaydet
      db.prepare(`
        INSERT INTO islemler (tip, gonderen_id, kulup_id, miktar, aciklama)
        VALUES (?, ?, ?, ?, ?)
      `).run('odeme', ogrenci_id, kulup_id, gerekliMiktar, `Kantinci ödemesi: ${tutar} değerinde`);
    });

    transaction();

    res.json({
      mesaj: 'Ödeme başarılı',
      harcanan_miktar: gerekliMiktar.toFixed(2),
      para_birimi: kulup.para_birimi_isim,
      tutar: tutar
    });
  } catch (error) {
    console.error('Ödeme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

// Öğrenci ara
const ogrenciAra = async (req, res) => {
  try {
    const { kullanici_adi } = req.query;

    const ogrenciler = db.prepare(`
      SELECT id, kullanici_adi
      FROM kullanicilar
      WHERE tip = 'ogrenci' AND kullanici_adi LIKE ?
    `).all(`%${kullanici_adi}%`);

    // Her öğrenci için tüm para birimlerini getir
    const ogrencilerWithCurrencies = ogrenciler.map(ogrenci => {
      const kulupler = db.prepare('SELECT * FROM kulupler').all();

      const para_birimleri = kulupler.map(kulup => {
        const cuzdan = db.prepare('SELECT miktar FROM ogrenci_cuzdanlari WHERE ogrenci_id = ? AND kulup_id = ?').get(ogrenci.id, kulup.id);

        let deger = parseFloat(kulup.baz_deger);
        if (kulup.puan > kulup.formul_esik) {
          const fazlaPuan = kulup.puan - kulup.formul_esik;
          const katsayi = Math.floor(fazlaPuan / kulup.formul_aralik);
          deger += katsayi * parseFloat(kulup.formul_artis);
        }

        return {
          kulup_id: kulup.id,
          kulup_isim: kulup.isim,
          para_birimi_isim: kulup.para_birimi_isim,
          miktar: cuzdan ? parseFloat(cuzdan.miktar) : 0,
          birim_deger: deger
        };
      });

      return {
        ...ogrenci,
        para_birimleri
      };
    });

    res.json(ogrencilerWithCurrencies);
  } catch (error) {
    console.error('Öğrenci arama hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

module.exports = {
  odemeYap,
  ogrenciAra
};
