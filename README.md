# E-Ticaret Proje Teslimi — RigForge: Donanım & E-Ticaret Platformu

Özel bilgisayar toplama (PC Builder), bileşen uyumluluk takibi ve dinamik sipariş yönetimini bir araya getiren tek mağazalı e-ticaret platformu. C# Web API mimarisi ve dinamik web arayüzü — gerçek SQL Server veritabanı API'sini tüketmektedir (mock veriler tamamen temizlenmiştir).

| Uygulama | Teknoloji | Kapsam |
| :--- | :--- | :--- |
| **Backend** | .NET 8 / ASP.NET Core Web API | Clean Architecture + Relational EF Core ORM, 6 Controller, ~20+ Endpoint |
| **Frontend** | Modular JavaScript (ES6+) + CSS3 + HTML5 | Müşteri Vitrini, PC Builder, Dinamik Sepet & Kullanıcı/Adres Paneli, Admin Paneli |
| **DevOps** | Docker & Docker Compose | Multi-stage Dockerfile, SQL Server 2022 Containerizasyonu |

Ürün listeleme ve kategorizasyondan PC Builder sistem toplamaya, JWT korumalı sepete ekleme, dinamik adres/tutar hesaplama ve veritabanı sipariş kaydına kadar checkout akışının tamamı uçtan uca çalışmaktadır.

---

## Ekip

* **Backend / API Architect:** Feyza Nur Dandal (https://github.com/feyzanurdandal)
* **Frontend / UI-UX Lead:** Ece Biricik (https://github.com/EceBiricik)

**Çalışma Modeli:** `feature/*` / `backend` → `main`. Backend API sözleşmesi ve DTO mimarisi önceden belirlenmiş; web arayüzü `api-client.js` üzerinden C# API ile entegre bir şekilde paralel ilerlemiştir.

---

## Proje Videosu 
- Link: https://drive.google.com/file/d/1vyGfNE5j-O9XrCbFiiP4EcycZCrKoTwY/view?usp=drivesdk

## Proje Raporu
- Link: https://docs.google.com/document/d/14CS9Tab4angFP42RueYBSc46rpbjObQA/edit?usp=drivesdk&ouid=100856546851127024987&rtpof=true&sd=true

---

##  Ne Yaptık?

### Backend (C# ASP.NET Core Web API)
Proje, katmanlı Clean Architecture yapısıyla (**RigForge.API**, **RigForge.Core**, **RigForge.Infrastructure**) geliştirilmiştir.

* **Sipariş & Sepet Orkestrasyonu (`OrdersController` & `CartController`):** Kullanıcının veritabanındaki aktif sepeti veya PC Builder/Client tarafından gelen dinamik tutarı hesaplayan, `0` ve negatif tutarlara karşı korumalı sipariş oluşturma mantığı.
* **Adres & Profil CRUD API (`AddressesController` & `ProfileController`):** Kullanıcı adreslerinin veritabanında saklanması, güncellenmesi ve silinmesini sağlayan tam CRUD yapısı.
* **Güvenlik (OWASP & BOLA/IDOR Koruması):**
  * JWT Bearer Token mimarisi (`15 dk` erişim süresi).
  * JWT Claim Validation (`NameIdentifier` & `Role`) ile kullanıcıların **yalnızca kendi adreslerini ve siparişlerini** görebilmesi/silebilmesi sağlandı.
  * Şifre güvenliği ve rol bazlı yetkilendirme (`[Authorize(Roles = "Admin")]`).
* **Veritabanı & ORM:** Entity Framework Core ilişkisel veri modelleri (`User`, `Adres`, `Order`, `OrderItem`, `Cart`, `CartItem`, `Product`). Migration'lar ve SQL seed verileri.

### Frontend (Modular Web)
* **Müşteri Vitrini:** Ana sayfa, bileşen listeleme (`/case.html`, `/motherboard.html`, `/cooler.html` vb.), dinamik ürün filtreleme ve arama.
* **PC Builder Entegrasyonu:** Bileşenlerin anlık seçilmesi, uyumluluk kontrolleri ve toplanan kasanın doğrudan sepete aktarılması.
* **Hesabım & Profil (`profile.js`):** `localStorage` mock bağımlılığından kurtarılarak doğrudan C# API'ye bağlanan dinamik adres yönetimi ve veritabanından çekilen gerçek sipariş geçmişi.
* **Sepet & Checkout (`cart.js`):** Dinamik tutar hesaplama, indirim kuponu düşüşü ve C# API'ye güvenli sipariş iletimi.
* **Admin Paneli (`admin.js`):** Sistem istatistikleri, ürün ekleme/güncelleme ve sipariş durumunu *"Hazırlanıyor"* statüsünden güncelleme yönetimi.

---

##  Kalite & Güvenlik

* **Güvenlik Doğrulaması:** Yetkisiz kullanıcı erişimlerinde `401 Unauthorized`, yetkisiz kaynak müdahalelerinde `404 Not Found` / `403 Forbidden` yanıtları RFC standartlarında döndürülmektedir.
* **E2E Doğrulama:** Başarılı sipariş oluşturma, sepette dinamik tutar hesabı, adres ekleme/silme ve Admin durum güncellemeleri SQL Server veritabanı üzerinden manuel test edilip doğrulanmıştır.

---

## Çalıştırma (Quick Start)

### 1. Docker ile Tek Komutta Çalıştırma (Tavsiye Edilen)
```bash
# Proje kök dizininde:
docker compose up -d --build
```

Backend API & Swagger: http://localhost:5000
SQL Server 2022: localhost:1433

### 2. Lokal Geliştirme Ortamı
```Bash
# Backend (C# API)
cd RigForge.API
dotnet run

# Frontend
# rigforge/ klasöründeki index.html dosyasını Live Server veya tarayıcı ile açabilirsin
```