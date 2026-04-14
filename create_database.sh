#!/bin/bash

echo "PostgreSQL veritabanı oluşturuluyor..."

# Veritabanı ve kullanıcı oluştur
sudo -u postgres psql << EOF
-- Veritabanı varsa sil ve yeniden oluştur
DROP DATABASE IF EXISTS endex;
DROP USER IF EXISTS endex_user;

-- Yeni veritabanı ve kullanıcı oluştur
CREATE DATABASE endex;
CREATE USER endex_user WITH PASSWORD 'endex123';
GRANT ALL PRIVILEGES ON DATABASE endex TO endex_user;
ALTER DATABASE endex OWNER TO endex_user;

-- PostgreSQL 15+ için ek izinler
\c endex
GRANT ALL ON SCHEMA public TO endex_user;

\q
EOF

if [ $? -eq 0 ]; then
    echo "✓ Veritabanı başarıyla oluşturuldu!"
    echo ""
    echo "Veritabanı bilgileri:"
    echo "  Host: localhost"
    echo "  Port: 5432"
    echo "  Database: endex"
    echo "  User: endex_user"
    echo "  Password: endex123"
else
    echo "✗ Veritabanı oluşturma hatası!"
    exit 1
fi
