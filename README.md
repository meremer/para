# Endex

5 kulüp için ekonomi yönetim sistemi. Her kulüp kendi para birimini yönetir ve öğrencilere dağıtır.

## Özellikler

- **Admin**: Kulüp puanları, para birimleri ve öğrenci hesapları yönetimi
- **Kulüp**: Öğrencilere para birimi dağıtımı
- **Öğrenci**: Cüzdan görüntüleme
- **Kantinci**: Öğrenci ödemeleri işleme

## Kulüpler

- Argeta
- Enart
- EKG
- Ensac
- Entech

## Kurulum

### Gereksinimler

- Node.js (v14+)
- PostgreSQL

### Backend Kurulumu

```bash
cd backend
npm install

# .env dosyası oluştur
cp .env.example .env

# .env dosyasını düzenle ve veritabanı bilgilerini gir
# DATABASE_URL=postgresql://kullanici:sifre@localhost:5432/endex
# JWT_SECRET=gizli-anahtar-buraya

# Sunucuyu başlat
npm start
```

### Frontend Kurulumu

```bash
cd frontend
npm install

# Geliştirme sunucusunu başlat
npm start
```

## Demo Hesaplar

Tüm hesapların şifresi: `demo123`

- **admin** - Yönetici
- **kantinci** - Kantinci
- **argeta** - Argeta Kulübü
- **enart** - Enart Kulübü
- **ekg** - EKG Kulübü
- **ensac** - Ensac Kulübü
- **entech** - Entech Kulübü
- **ogrenci** - Örnek Öğrenci

## Para Birimi Değer Formülü

```
değer = baz_deger + (floor((puan - eşik) / aralık) * artış)
```

Örnek: 
- Baz değer: 1.0
- Eşik: 100
- Aralık: 100
- Artış: 0.1

250 puan için: 1.0 + (floor((250-100)/100) * 0.1) = 1.0 + 0.1 = 1.1

## Render'a Deploy

### Backend

1. Render.com'da yeni PostgreSQL veritabanı oluştur
2. Yeni Web Service oluştur
3. Repository'yi bağla
4. Ayarlar:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     - `DATABASE_URL`: PostgreSQL bağlantı URL'si
     - `JWT_SECRET`: Güvenli bir anahtar
     - `NODE_ENV`: production

### Frontend

1. Render.com'da yeni Static Site oluştur
2. Repository'yi bağla
3. Ayarlar:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`
   - Environment Variables:
     - `REACT_APP_API_URL`: Backend URL'si

## Localhost Kullanımı

Backend varsayılan olarak `http://localhost:5000` üzerinde çalışır.
Frontend varsayılan olarak `http://localhost:3000` üzerinde çalışır.

## API Endpoints

### Auth
- `POST /api/auth/giris` - Giriş yap

### Admin
- `GET /api/admin/kulupler` - Kulüpleri listele
- `POST /api/admin/kulup/puan` - Kulüp puanı güncelle
- `PUT /api/admin/kulup/bilgi` - Kulüp bilgilerini güncelle
- `POST /api/admin/kulup/para` - Kulübe para ver
- `POST /api/admin/ogrenci` - Öğrenci oluştur

### Kulüp
- `GET /api/kulup/bakiye` - Bakiye görüntüle
- `GET /api/kulup/ogrenciler` - Öğrencileri listele
- `POST /api/kulup/para-ver` - Öğrenciye para ver

### Öğrenci
- `GET /api/ogrenci/cuzdan` - Cüzdan görüntüle

### Kantinci
- `GET /api/kantinci/ogrenci-ara` - Öğrenci ara
- `POST /api/kantinci/odeme` - Ödeme yap

## Lisans

MIT
