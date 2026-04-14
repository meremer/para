import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import KulupDashboard from './components/KulupDashboard';
import OgrenciDashboard from './components/OgrenciDashboard';
import KantinciDashboard from './components/KantinciDashboard';
import { auth } from './services/api';
import './App.css';

function App() {
  const [kullanici, setKullanici] = useState(null);

  useEffect(() => {
    const kaydedilmisKullanici = localStorage.getItem('kullanici');
    const token = localStorage.getItem('token');
    if (kaydedilmisKullanici && token) {
      setKullanici(JSON.parse(kaydedilmisKullanici));
    }
  }, []);

  const handleLogin = (kullaniciData) => {
    setKullanici(kullaniciData);
  };

  const handleLogout = () => {
    auth.cikisYap();
    setKullanici(null);
  };

  const renderDashboard = () => {
    switch (kullanici?.tip) {
      case 'admin':
        return <AdminDashboard />;
      case 'kulup':
        return <KulupDashboard />;
      case 'ogrenci':
        return <OgrenciDashboard />;
      case 'kantinci':
        return <KantinciDashboard />;
      default:
        return <div>Bilinmeyen kullanıcı tipi</div>;
    }
  };

  if (!kullanici) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h2>Endex</h2>
          <div className="user-info">
            <span>{kullanici.kullanici_adi} ({kullanici.tip})</span>
            <button onClick={handleLogout} className="logout-btn">Çıkış Yap</button>
          </div>
        </div>
      </header>
      <main className="app-main">
        {renderDashboard()}
      </main>
    </div>
  );
}

export default App;
