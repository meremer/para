const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Kulüp puanı ekle/çıkar
const kulupPuanGuncelle = async (req, res) => {
  try {
    const { kulup_id, puan, islem } = req.body;

    const kulup = db.prepare('SELECT * FROM kulupler WHERE id = ?').get(kulup_id);

    if (!kulup) {
      return res.status(404).json({ hata: 'Kulüp bulunamadı' });
    }

    let yeniPuan = kulup.puan;
    if (islem === 'ekle') {
      yeniPuan += puan;
    } else if (islem === 'cikar') {
      yeniPuan = Math.max(0, yeniPuan - puan);
    }

    db.prepare('UPDATE kulupler SET puan = ? WHERE id = ?').run(yeniPuan, kulup_id);

    db.prepare(`
      INSERT INTO islemler (tip, kulup_id, miktar, aciklama)
      VALUES (?, ?, ?, ?)
    `).run(`puan_${islem}`, kulup_id, puan, `Admin tarafından ${islem === 'ekle' ? 'eklendi' : 'çıkarıldı'}`);

    const guncelKulup = db.prepare('SELECT * FROM kulupler WHERE id = ?').get(kulup_id);
    res.json({ mesaj: 'Puan güncellendi', kulup: guncelKulup });
  } catch (error) {
    console.error('Puan güncelleme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

// Kulüp bilgilerini güncelle
const kulupBilgiGuncelle = async (req, res) => {
  try {
    const { kulup_id, para_birimi_isim, para_birimi_logo, baz_deger, formul_esik, formul_artis, formul_aralik } = req.body;

    const updates = [];
    const values = [];

    if (para_birimi_isim !== undefined) {
      updates.push('para_birimi_isim = ?');
      values.push(para_birimi_isim);
    }
    if (para_birimi_logo !== undefined) {
      updates.push('para_birimi_logo = ?');
      values.push(para_birimi_logo);
    }
    if (baz_deger !== undefined) {
      updates.push('baz_deger = ?');
      values.push(baz_deger);
    }
    if (formul_esik !== undefined) {
      updates.push('formul_esik = ?');
      values.push(formul_esik);
    }
    if (formul_artis !== undefined) {
      updates.push('formul_artis = ?');
      values.push(formul_artis);
    }
    if (formul_aralik !== undefined) {
      updates.push('formul_aralik = ?');
      values.push(formul_aralik);
    }

    if (updates.length === 0) {
      return res.status(400).json({ hata: 'Güncellenecek alan belirtilmedi' });
    }

    values.push(kulup_id);
    const sql = `UPDATE kulupler SET ${updates.join(', ')} WHERE id = ?`;

    db.prepare(sql).run(...values);

    const kulup = db.prepare('SELECT * FROM kulupler WHERE id = ?').get(kulup_id);

    if (!kulup) {
      return res.status(404).json({ hata: 'Kulüp bulunamadı' });
    }

    res.json({ mesaj: 'Kulüp bilgileri güncellendi', kulup });
  } catch (error) {
    console.error('Kulüp güncelleme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

// Kulübe para birimi ver
const kulupParaVer = async (req, res) => {
  try {
    const { kulup_id, miktar } = req.body;

    const bakiye = db.prepare('SELECT * FROM kulup_para_birimleri WHERE kulup_id = ?').get(kulup_id);

    if (!bakiye) {
      return res.status(404).json({ hata: 'Kulüp bulunamadı' });
    }

    db.prepare('UPDATE kulup_para_birimleri SET miktar = miktar + ? WHERE kulup_id = ?').run(miktar, kulup_id);

    db.prepare(`
      INSERT INTO islemler (tip, kulup_id, miktar, aciklama, gonderen_id)
      VALUES (?, ?, ?, ?, ?)
    `).run('para_ver', kulup_id, miktar, 'Admin tarafından para verildi', req.kullanici.id);

    const guncelBakiye = db.prepare('SELECT * FROM kulup_para_birimleri WHERE kulup_id = ?').get(kulup_id);
    res.json({ mesaj: 'Para verildi', bakiye: guncelBakiye });
  } catch (error) {
    console.error('Para verme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

// Öğrenci hesabı oluştur
const ogrenciOlustur = async (req, res) => {
  try {
    const { kullanici_adi, sifre } = req.body;

    const hashedPassword = await bcrypt.hash(sifre, 10);

    const result = db.prepare(`
      INSERT INTO kullanicilar (kullanici_adi, sifre, tip)
      VALUES (?, ?, 'ogrenci')
    `).run(kullanici_adi, hashedPassword);

    const ogrenci = db.prepare('SELECT id, kullanici_adi, tip FROM kullanicilar WHERE id = ?').get(result.lastInsertRowid);

    res.json({ mesaj: 'Öğrenci oluşturuldu', ogrenci });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ hata: 'Bu kullanıcı adı zaten kullanılıyor' });
    }
    console.error('Öğrenci oluşturma hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

// Tüm kulüpleri listele
const kulupleriListele = async (req, res) => {
  try {
    const kulupler = db.prepare(`
      SELECT k.*, kpb.miktar as para_bakiye
      FROM kulupler k
      LEFT JOIN kulup_para_birimleri kpb ON k.id = kpb.kulup_id
      ORDER BY k.isim
    `).all();

    // Her kulüp için para birimi değerini hesapla
    const kuluplerWithDeger = kulupler.map(kulup => {
      let deger = parseFloat(kulup.baz_deger);
      if (kulup.puan > kulup.formul_esik) {
        const fazlaPuan = kulup.puan - kulup.formul_esik;
        const katsayi = Math.floor(fazlaPuan / kulup.formul_aralik);
        deger += katsayi * parseFloat(kulup.formul_artis);
      }
      return { ...kulup, para_degeri: deger.toFixed(2) };
    });

    res.json(kuluplerWithDeger);
  } catch (error) {
    console.error('Kulüp listeleme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

module.exports = {
  kulupPuanGuncelle,
  kulupBilgiGuncelle,
  kulupParaVer,
  ogrenciOlustur,
  kulupleriListele
};
