const db = require('./database');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  try {
    console.log('Veritabanı oluşturuluyor...');

    // Kulüpler tablosu
    db.exec(`
      CREATE TABLE IF NOT EXISTS kulupler (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        isim TEXT UNIQUE NOT NULL,
        puan INTEGER DEFAULT 0,
        para_birimi_isim TEXT NOT NULL,
        para_birimi_logo TEXT,
        baz_deger REAL DEFAULT 1.0,
        formul_esik INTEGER DEFAULT 100,
        formul_artis REAL DEFAULT 0.1,
        formul_aralik INTEGER DEFAULT 100,
        olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Kullanıcılar tablosu
    db.exec(`
      CREATE TABLE IF NOT EXISTS kullanicilar (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kullanici_adi TEXT UNIQUE NOT NULL,
        sifre TEXT NOT NULL,
        tip TEXT NOT NULL CHECK (tip IN ('admin', 'kulup', 'ogrenci', 'kantinci')),
        kulup_id INTEGER REFERENCES kulupler(id),
        olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Para birimleri tablosu
    db.exec(`
      CREATE TABLE IF NOT EXISTS kulup_para_birimleri (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kulup_id INTEGER UNIQUE REFERENCES kulupler(id) ON DELETE CASCADE,
        miktar REAL DEFAULT 0
      )
    `);

    // Öğrenci cüzdanları tablosu
    db.exec(`
      CREATE TABLE IF NOT EXISTS ogrenci_cuzdanlari (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ogrenci_id INTEGER REFERENCES kullanicilar(id) ON DELETE CASCADE,
        kulup_id INTEGER REFERENCES kulupler(id) ON DELETE CASCADE,
        miktar REAL DEFAULT 0,
        UNIQUE(ogrenci_id, kulup_id)
      )
    `);

    // İşlemler tablosu
    db.exec(`
      CREATE TABLE IF NOT EXISTS islemler (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tip TEXT NOT NULL,
        gonderen_id INTEGER REFERENCES kullanicilar(id),
        alici_id INTEGER REFERENCES kullanicilar(id),
        kulup_id INTEGER REFERENCES kulupler(id),
        miktar REAL NOT NULL,
        aciklama TEXT,
        tarih DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5 kulübü oluştur
    const kulupler = [
      { isim: 'Argeta', para_birimi: 'Argeta Parası' },
      { isim: 'Enart', para_birimi: 'Enart Parası' },
      { isim: 'EKG', para_birimi: 'EKG Parası' },
      { isim: 'Ensac', para_birimi: 'Ensac Parası' },
      { isim: 'Entech', para_birimi: 'Entech Parası' }
    ];

    const insertKulup = db.prepare(`
      INSERT OR IGNORE INTO kulupler (isim, para_birimi_isim)
      VALUES (?, ?)
    `);

    const insertParaBirimi = db.prepare(`
      INSERT OR IGNORE INTO kulup_para_birimleri (kulup_id, miktar)
      VALUES (?, 0)
    `);

    for (const kulup of kulupler) {
      const result = insertKulup.run(kulup.isim, kulup.para_birimi);
      if (result.changes > 0) {
        const kulupId = result.lastInsertRowid;
        insertParaBirimi.run(kulupId);
      }
    }

    // Demo hesapları oluştur
    const hashedPassword = await bcrypt.hash('demo123', 10);

    const insertKullanici = db.prepare(`
      INSERT OR IGNORE INTO kullanicilar (kullanici_adi, sifre, tip, kulup_id)
      VALUES (?, ?, ?, ?)
    `);

    // Admin hesabı
    insertKullanici.run('admin', hashedPassword, 'admin', null);

    // Kantinci hesabı
    insertKullanici.run('kantinci', hashedPassword, 'kantinci', null);

    // Her kulüp için bir hesap
    const kuluplar = db.prepare('SELECT id, isim FROM kulupler').all();
    for (const kulup of kuluplar) {
      insertKullanici.run(kulup.isim.toLowerCase(), hashedPassword, 'kulup', kulup.id);
    }

    // Demo öğrenci hesabı
    insertKullanici.run('ogrenci', hashedPassword, 'ogrenci', null);

    console.log('✓ Veritabanı başarıyla oluşturuldu!');
  } catch (error) {
    console.error('Veritabanı oluşturma hatası:', error);
    throw error;
  }
};

module.exports = initDatabase;
