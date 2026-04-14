#!/bin/bash

echo "Endex Kurulumu Başlıyor..."

# Backend kurulumu
echo "Backend bağımlılıkları yükleniyor..."
cd backend
npm install

# .env dosyası oluştur
if [ ! -f .env ]; then
    echo ".env dosyası oluşturuluyor..."
    cp .env.example .env
    echo "UYARI: backend/.env dosyasını düzenleyip veritabanı bilgilerinizi girin!"
fi

cd ..

# Frontend kurulumu
echo "Frontend bağımlılıkları yükleniyor..."
cd frontend
npm install

# .env dosyası oluştur
if [ ! -f .env ]; then
    echo ".env dosyası oluşturuluyor..."
    cp .env.example .env
fi

cd ..

echo ""
echo "Kurulum tamamlandı!"
echo ""
echo "Sonraki adımlar:"
echo "1. PostgreSQL veritabanı oluşturun"
echo "2. backend/.env dosyasını düzenleyin"
echo "3. Backend'i başlatın: cd backend && npm start"
echo "4. Yeni terminalde frontend'i başlatın: cd frontend && npm start"
echo ""
echo "Demo hesaplar (şifre: demo123):"
echo "- admin, kantinci, argeta, enart, ekg, ensac, entech, ogrenci"
