const db = require('../config/database');

// Öğrencinin cüzdanını görüntüle
const cuzdanGoruntule = async (req, res) => {
  try {
    const ogrenci_id = req.kullanici.id;

    const cuzdan = db.prepare(`
      SELECT oc.miktar, k.isim as kulup_isim, k.para_birimi_isim, k.para_birimi_logo,
             k.puan, k.baz_deger, k.formul_esik, k.formul_artis, k.formul_aralik
      FROM ogrenci_cuzdanlari oc
      JOIN kulupler k ON oc.kulup_id = k.id
      WHERE oc.ogrenci_id = ? AND oc.miktar > 0
      ORDER BY k.isim
    `).all(ogrenci_id);

    // Her para birimi için değeri hesapla
    const cuzdanWithDeger = cuzdan.map(item => {
      let deger = parseFloat(item.baz_deger);
      if (item.puan > item.formul_esik) {
        const fazlaPuan = item.puan - item.formul_esik;
        const katsayi = Math.floor(fazlaPuan / item.formul_aralik);
        deger += katsayi * parseFloat(item.formul_artis);
      }
      const toplamDeger = parseFloat(item.miktar) * deger;
      return {
        kulup_isim: item.kulup_isim,
        para_birimi_isim: item.para_birimi_isim,
        para_birimi_logo: item.para_birimi_logo,
        miktar: parseFloat(item.miktar).toFixed(2),
        birim_deger: deger.toFixed(2),
        toplam_deger: toplamDeger.toFixed(2)
      };
    });

    res.json(cuzdanWithDeger);
  } catch (error) {
    console.error('Cüzdan görüntüleme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

module.exports = {
  cuzdanGoruntule
};
