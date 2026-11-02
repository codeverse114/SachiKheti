# 🌾 SachiKheti (ਸੱਚੀ ਖੇਤੀ) - Digital Agricultural Platform
> **Empowered by Lamma Farmer Producer Co. Ltd. (LFPC)**  
> Developed according to CodeVerse specifications ([CodeVerse.pdf](file:///e:/SachiKheti/CodeVerse.pdf))

---

## 🎨 Visual Identity & Brand Colors

The design system incorporates the brand identity extracted directly from the official logo lockup and badge:

* **Pure Crop Green (ਸੱਚੀ):** `#0A3E22` (Deep Forest) ➔ `#15733E` (Verdant Field) ➔ `#2E9D4E` (Sprout Green)
* **Harvest Sun Gold / Pure Ghee (ਖੇਤੀ):** `#B46F00` (Roasted Amber) ➔ `#E59800` (Pure Ghee) ➔ `#FBBF24` (Harvest Sun)
* **Brand Slogan:** `ਚੰਗੀ ਸੋਚ ਸਖ਼ਤ ਮਿਹਨਤ, ਫਿਰ ਹੁੰਦੀ ਰੱਬ ਦੀ ਰਹਿਮਤ`
* **Brand Assets in repository:**
  * Full Brand Lockup: `client/public/assets/brand/sachi-kheti-logo-full.jpg`
  * Emblem Badge: `client/public/assets/brand/sachi-kheti-emblem.jpg`

---

## 🔐 Superadmin Credentials

* **Admin Portal Trigger:** Click the **Admin** button in the top navbar.
* **Username:** `SachiKhetiAdmin`
* **Password:** `Sachi@Kheti123`
* **Access Capabilities:**
  * Live Order Management (Change status: `PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).
  * Catalog Management (Create, edit, change pricing, and toggle stock availability).
  * Real-time Revenue & Order Metrics.

---

## 🛒 Dual-Channel Ordering System

1. **1-Click WhatsApp Assisted Checkout:**
   * Customer fills address and clicks **Send Order to WhatsApp**.
   * Automatically formats ordered items, quantities, SKU names, address, and total into a message sent directly to LFPC (+91-8295886832).
2. **Prepaid Online Payment via Razorpay:**
   * Integrates cards, UPI, and NetBanking.
   * Cryptographic server-side payment signature verification.

---

## 🚀 Running Locally

### 1. Start the Express Backend
```bash
cd server
npm run dev
```
The server will run at `http://localhost:5000` (health check: `http://localhost:5000/api/health`).

### 2. Start the React Frontend
In a new terminal window:
```bash
cd client
npm run dev
```
The client will run at `http://localhost:3000` and automatically proxies `/api` calls to the server.

---

## ☁️ Deployment Architecture: AWS RDS + Single AWS EC2

This repository is optimized for deployment on a **single AWS EC2 instance** connected to an **AWS RDS PostgreSQL** instance:

```
[Customer Browser] ──> Port 80/443 ──> [Nginx Reverse Proxy on EC2]
                                            ├── Static Files (/client/dist)
                                            └── /api/* Proxy ──> [PM2 Node.js (Port 5000)]
                                                                       │
                                                                 Prisma Connection
                                                                       ▼
                                                          [AWS RDS PostgreSQL DB]
```

### 1. Configure AWS RDS PostgreSQL
1. Create a PostgreSQL instance in AWS RDS.
2. In `server/.env`, set your connection string:
   ```env
   DATABASE_URL="postgresql://<db_user>:<db_password>@<rds_endpoint>:5432/sachikhetidb?schema=public&sslmode=prefer"
   ```
3. To switch the Prisma schema to PostgreSQL, copy the ready schema:
   ```bash
   cp server/prisma/schema.postgresql.prisma server/prisma/schema.prisma
   cd server && npx prisma db push && node prisma/seed.js
   ```

### 2. Single AWS EC2 Instance Setup
1. Launch an Ubuntu EC2 instance (e.g. `t3.small`).
2. Install Node.js, Nginx, and PM2:
   ```bash
   sudo apt update && sudo apt install -y nginx nodejs npm
   sudo npm install -g pm2
   ```
3. Copy `nginx.conf` into `/etc/nginx/sites-available/sachikheti` and enable it:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/sachikheti
   sudo ln -s /etc/nginx/sites-available/sachikheti /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```
4. Run the automated deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
