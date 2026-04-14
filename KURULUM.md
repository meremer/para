# Endex - Hızlı Başlangıç

## Kurulum Adımları

### 1. PostgreSQL Veritabanı Oluştur

```bash
# PostgreSQL'e bağlan
psql -U postgres

# Veritabanı oluştur
CREATE DATABASE endex;

# Çıkış
\q
```

### 2. Otomatik Kurulum

```bash
# Kurulum scriptini çalıştır
./setup.sh
```

### 3. Backend .env Dosyasını Düzenle

`backend/.env` dosyasını açın ve düzenleyin:

```env
PORT=5000
DATABASE_URL=postgresql://kullanici:sifre@localhost:5432/endex
JWT_SECRET=gizli-anahtar-buraya-uzun-ve-guvenli
NODE_ENV=development
```

### 4. Uygulamayı Başlat

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Tarayıcınızda `http://localhost:3000` adresine gidin.

## Demo Hesaplar

Tüm hesapların şifresi: `demo123`

| Kullanıcı Adı | Tip | Açıklama |
|---------------|-----|----------|
| admin | Admin | Tüm sistemi yönetir |
| kantinci | Kantinci | Öğrenci ödemelerini işler |
| argeta | Kulüp | Argeta kulübü |
| enart | Kulüp | Enart kulübü |
| ekg | Kulüp | EKG kulübü |
| ensac | Kulüp | Ensac kulübü |
| entech | Kulüp | Entech kulübü |
| ogrenci | Öğrenci | Örnek öğrenci hesabı |

## Kullanım Senaryosu

1. **Admin** olarak giriş yap
2. Bir kulübe puan ekle (örn: Argeta'ya 150 puan)
3. Kulübe para birimi ver (örn: 100 Argeta Parası)
4. **Argeta** kulübü olarak giriş yap
5. Öğrenciye para ver (örn: ogrenci'ye 50 Argeta Parası)
6. **Öğrenci** olarak giriş yap ve cüzdanı görüntüle
7. **Kantinci** olarak giriş yap
8. Öğrenci ara ve ödeme işlemi yap

## Render'a Deploy

### Backend Deploy

1. Render.com'da PostgreSQL veritabanı oluştur
2. Web Service oluştur:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment Variables:**
     - `DATABASE_URL`: PostgreSQL Internal Database URL
     - `JWT_SECRET`: Güvenli bir anahtar
     - `NODE_ENV`: production

### Frontend Deploy

1. Static Site oluştur:
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/build`
   - **Environment Variables:**
     - `REACT_APP_API_URL`: Backend URL'niz

## Sorun Giderme

### Veritabanı Bağlantı Hatası

```bash
# PostgreSQL'in çalıştığından emin olun
sudo systemctl status postgresql

# Başlatın
sudo systemctl start postgresql
```

### Port Zaten Kullanımda

Backend veya frontend portu kullanımdaysa, .env dosyasında PORT değerini değiştirin.

### CORS Hatası

Backend'de CORS ayarları yapılandırılmıştır. Sorun devam ederse backend/src/server.js dosyasında cors ayarlarını kontrol edin.

## Özellikler

### Admin Paneli
- ✅ Kulüp puanı ekle/çıkar
- ✅ Para birimi ayarları (isim, logo, formül)
- ✅ Kulüplere para birimi ver
- ✅ Öğrenci hesabı oluştur

### Kulüp Paneli
- ✅ Bakiye görüntüle
- ✅ Öğrencilere para dağıt
- ✅ Öğrenci listesi

### Öğrenci Paneli
- ✅ Cüzdan görüntüle
- ✅ Para birimi miktarları
- ✅ Toplam değer hesaplama

### Kantinci Paneli
- ✅ Öğrenci ara
- ✅ Para birimi seç
- ✅ Otomatik hesaplama
- ✅ Ödeme işlemi

## Para Birimi Değer Formülü

```
değer = baz_deger + (floor((puan - eşik) / aralık) * artış)
```

**Örnek:**
- Baz değer: 1.0
- Eşik: 100
- Aralık: 100
- Artış: 0.1

**Hesaplama:**
- 50 puan → 1.0 (eşiğin altında)
- 150 puan → 1.0 + (floor(50/100) * 0.1) = 1.0
- 250 puan → 1.0 + (floor(150/100) * 0.1) = 1.1
- 350 puan → 1.0 + (floor(250/100) * 0.1) = 1.2

## Teknolojiler

- **Backend:** Node.js, Express, PostgreSQL, JWT
- **Frontend:** React, Axios
- **Styling:** Custom CSS
- **Database:** PostgreSQL

## Lisans

MIT
