Backend & Infrastructure:
- Framework: NestJS (TypeScript)
- Database: PostgreSQL (via TypeORM)
- Message Broker: RabbitMQ
- Containerization: Docker & Docker Compose

Frontend Apps:
- Framework: React.js (TypeScript) + Vite
- UI Library: Ant Design (Antd)
- State & API Management: Axios

==============================================

CARA MENJALANKAN PROJECT

Prasyarat:
perangkat harussudah terinstal:
- Git (https://git-scm.com/)
- Docker Desktop (https://www.docker.com/products/docker-desktop/)

Langkah-Langkah Installation & Run:

Clone Repositori
- git clone https://github.com/prabszx10/sistem-absensi
- cd sistem-absensi

Jalankan perintah ini pada root folder proyek (sistem-absensi):
- docker compose up -d --build

Setelah semua container berstatus running, berikut info port yang digunakan:
http://localhost:5173 => Frontend App (User):    
http://localhost:5174 => Frontend Admin:         
http://localhost:3000 => Backend API
http://localhost:15672 => RabbitMQ Management      

Untuk melihat endpoint apa saja yang digunakan bisa melalui swagger ui:
http://localhost:3000/api/docs


CATATAN PENGUJIAN LOKAL (AUTH SESSION)
Karena browser membagikan LocalStorage dan Cookie pada domain localhost tanpa membedakan Port:
Akses Frontend App melalui:  http://localhost:5173
Akses Frontend Admin melalui: http://localhost:5174 (buka dengan browser yang berbeda atau dengan incognito tab)

Hal ini bertujuan agar Session Auth/Token antara akun Karyawan dan Admin tidak saling tertimpa saat dibuka bersamaan.