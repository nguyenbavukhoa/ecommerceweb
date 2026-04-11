# 🛒 Secure E-commerce Platform

<div align="right">
  <a href="./README.vi.md">🇻🇳 Tiếng Việt</a>
</div>

![Java](https://img.shields.io/badge/Java-17+-orange?logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-red?logo=redis)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

A full-stack e-commerce platform with multi-layer security: email verification, OTP 2FA, brute-force protection, VNPay payment integration, and complete order management.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)

---

## 🌟 Overview

A food e-commerce web application built with a **Client-Server** model, focused on security and user experience:

- **Backend**: RESTful API with Spring Boot 3, handling all business logic, multi-layer security, and real payment gateway integration.
- **Frontend**: Single Page Application with React 19 + Ant Design, delivering a smooth shopping experience.
- **Infrastructure**: Full stack (App + PostgreSQL + Redis) containerized with Docker Compose — one command to run everything.

---


## ✨ Features

### 🔐 Multi-layer Authentication & Security
- Register / Login with email + password (BCrypt hashing).
- **Email verification** on signup — account only activated after clicking the confirmation link.
- **OTP 2FA** via email for forgot password flow — Redis TTL-based (5 min), limited retry attempts.
- **Brute-force protection**: temporary account lock after N failed login attempts (configurable).
- **Stateless JWT**: Access Token (short-lived) + Refresh Token (7 days) + Token Blacklist on logout.
- **OTP Rate Limiting**: per-minute and per-hour send limits.

### 🛍️ Products & Categories
- Product management with multiple variants (Options Group + Options Values).
- Category-based classification with filtering and pagination.
- Image upload to **Cloudinary** (auto-resize, CDN delivery, 10MB max).

### 🛒 Cart & Orders
- Add / update / remove cart items with quantity and variant selection.
- Checkout from cart or direct admin order creation.
- Full order status tracking (Order Status History).
- Shipping address management (User Information).

### 💳 Payment
- **Cash on Delivery (COD)** support.
- Real **VNPay** payment gateway integration (Sandbox) with callback handling.
- Auto-generate **Invoice** and send order confirmation email after successful payment.

### 🎟️ Vouchers & Promotions
- Create and manage discount codes — percentage or fixed-amount types.
- Expiry date and usage limit enforcement.
- Dynamic filtering via JPA Specification.

### 📧 Email Notifications
- Account verification email on registration.
- OTP email for forgot password flow.
- Order confirmation + invoice email after payment.

### 👨‍💼 Admin
- Product management (create, update).
- View all orders, create orders on behalf of customers.
- Manage vouchers and payment methods.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)                │
│         React 19 + Redux Toolkit + Ant Design + React Query  │
└────────────────┬─────────────────────────────────────────────┘
                 │  REST API (JSON)
                 ▼
┌──────────────────────────────────────────────────────────────┐
│              Spring Boot Backend (Port 8080)                 │
│                                                              │
│  ┌────────────┐   ┌──────────┐   ┌────────────────────────┐ │
│  │ Controller │──▶│ Service  │──▶│     Repository (JPA)   │ │
│  └────────────┘   └──────────┘   └────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Security Layer                                     │    │
│  │  JWT Filter │ Rate Limit Filter │ Login Attempt     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌───────────────────┐   ┌──────────────────────────────┐  │
│  │  Event Publisher  │   │  Global Exception Handler    │  │
│  │  (Async Email)    │   │  (CustomizedResponseEntity)  │  │
│  └───────────────────┘   └──────────────────────────────┘  │
└────────┬──────────────────┬────────────────┬────────────────┘
         ▼                  ▼                ▼
  ┌─────────────┐   ┌──────────────┐  ┌─────────────────┐
  │ PostgreSQL  │   │  Redis 7     │  │   Cloudinary    │
  │ (Port 5432) │   │  (Port 6379) │  │   (CDN Images)  │
  │ Main data   │   │  OTP, Token  │  │                 │
  └─────────────┘   │  Blacklist,  │  └─────────────────┘
                    │  Rate Limit  │
                    └──────────────┘
                          │
                    ┌─────▼──────┐
                    │   VNPay    │
                    │ (Sandbox)  │
                    └────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17+ | Primary language |
| Spring Boot | 3.3.5 | Backend framework |
| Spring Security | 6.x | Auth & authorization |
| Spring Data JPA | 3.x | ORM & database access |
| Spring Data Redis | 3.x | Cache, OTP, Token Blacklist |
| Spring Mail | 3.x | Verification & OTP emails |
| JWT (jjwt) | 0.12.3 | Stateless authentication |
| Cloudinary SDK | 1.38.0 | Image upload & processing |
| VNPay | — | Payment gateway |
| PostgreSQL | 17 | Primary database |
| Redis | 7 | Caching & session store |
| Docker / Compose | — | Containerization |
| Lombok | 1.18.36 | Boilerplate reduction |
| Maven | 3.9 | Build & dependency management |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Redux Toolkit | 2.x | State management |
| React Query | 5.x | Server state & caching |
| React Router | 6.x | Client-side routing |
| Ant Design | 5.x | UI component library |
| Styled Components | 6.x | CSS-in-JS styling |
| React Slick | — | Image carousel |

---

## 📁 Project Structure

```
ecommerce/
├── Backend/                                  # Spring Boot Backend
│   ├── Dockerfile
│   ├── docker-compose.yml                    # Full stack: App + PostgreSQL + Redis
│   └── src/main/java/com/e_commerce/
│       ├── configuration/                    # Security, Redis, VNPay, Cloudinary config
│       ├── controller/                       # REST Controllers by module
│       │   ├── account/                      # Auth, UserInfo
│       │   ├── cart/                         # CartItems
│       │   ├── invoice/                      # Invoice
│       │   ├── orders/                       # Order, OrderStatusHistory
│       │   ├── otp/                          # OTP resend
│       │   ├── payment/                      # Payment, VNPay callback
│       │   ├── product/                      # Product, Category, Options
│       │   └── voucher/                      # Voucher
│       ├── dto/                              # Request & Response DTOs
│       ├── entity/                           # JPA Entities
│       ├── enums/                            # AccountRole, OrderStatus, VoucherType...
│       ├── event/                            # Async Events (email sent asynchronously)
│       ├── exceptions/                       # GlobalExceptionHandler, CustomException
│       ├── mapper/                           # Entity <-> DTO Mappers
│       ├── repository/                       # Spring Data JPA Repositories
│       ├── service/                          # Business Logic (Interface + Impl)
│       ├── specification/                    # JPA Specifications (dynamic queries)
│       └── util/                             # JwtUtil, OtpUtil, VNPayUtil, LoginAttemptService
│
├── FrontEnd/                                 # React Frontend
│   └── src/
│       ├── components/                       # Reusable UI components
│       ├── pages/                            # HomePage, ProductsPage, OrderPage, AdminPage
│       ├── redux/                            # Redux store & slices
│       ├── context/                          # AuthContext, ToastContext
│       ├── Hooks/                            # useProducts, useCategory
│       └── routes/                           # Route definitions
│
└── SQLScript/                                # Database scripts & Postman collections
    ├── sql_ecommerce.png                     # ERD diagram
    ├── Insert_Database.sql
    └── *.postman_collection.json             # API test collections (v1, v2, v3)
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:8080/api/v1`

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | POST | `/auth/register` | Register account |
| | POST | `/auth/login` | Login → JWT |
| | POST | `/auth/logout` | Logout (blacklist token) |
| | POST | `/auth/refresh-token` | Refresh access token |
| | GET | `/auth/activate` | Activate account via email |
| | POST | `/auth/forgot-password` | Send OTP for password reset |
| | POST | `/auth/reset-password` | Reset password after OTP |
| **OTP** | POST | `/otp/resend` | Resend OTP |
| **User Info** | GET | `/user-info/{accountId}` | Get shipping info |
| | POST | `/user-info` | Create shipping info |
| | PUT | `/user-info/{userInfoId}` | Update shipping info |
| **Product** | GET | `/products` | Product list (paginated) |
| | GET | `/products/detail/{id}` | Product detail |
| | POST | `/products/create` | Create product (Admin) |
| | PUT | `/products/update/{id}` | Update product (Admin) |
| **Category** | GET | `/categories/all` | All categories |
| **Cart** | GET | `/cart-items` | Current cart |
| | POST | `/cart-items/addCart` | Add to cart |
| | PUT | `/cart-items/{id}/quantity` | Update quantity |
| | DELETE | `/cart-items/{cartId}` | Remove item |
| | DELETE | `/cart-items/account` | Clear cart |
| **Order** | POST | `/orders/create` | Create order from cart |
| | GET | `/orders/all` | All orders (Admin) |
| | GET | `/order-status-history/{orderId}` | Order status history |
| **Payment** | GET | `/payments/pay` | Initiate payment (COD/VNPay) |
| | GET/POST | `/payments/vnpay/callback` | VNPay result callback |
| **Voucher** | GET | `/vouchers` | Voucher list |
| | POST | `/vouchers/create` | Create voucher (Admin) |
| | GET | `/vouchers/check/{code}` | Validate voucher |
| | DELETE | `/vouchers/delete/{id}` | Delete voucher (Admin) |
| **Invoice** | POST | `/invoices/create` | Create invoice |
| | GET | `/invoices` | Invoice list |

---

## 🚀 Getting Started

### Requirements
- Docker & Docker Compose
- Java 17+ (without Docker)
- Node.js 18+ (for Frontend)
- [Cloudinary](https://cloudinary.com) account (free tier is sufficient)
- [VNPay Sandbox](https://sandbox.vnpayment.vn) account (optional)

### ⚡ Run Full Backend with Docker (recommended)

```bash
cd Backend

# 1. Create environment file
cp .env.example .env

# 2. Fill in your values (see table below)
nano .env

# 3. Start full stack (App + PostgreSQL + Redis)
docker-compose up -d

# Server: http://localhost:8080/api/v1
```

#### Environment Variables

| Variable | Example | Description |
|---|---|---|
| `DB_NAME` | `ecommerce` | Database name |
| `DB_USERNAME` | `postgres` | DB username |
| `DB_PASSWORD` | `yourpassword` | DB password |
| `DB_PORT` | `5432` | PostgreSQL port |
| `REDIS_HOST` | `redis` | Redis host (use service name in Docker) |
| `REDIS_PORT` | `6379` | Redis port |
| `JWT_ACCESS_TOKEN_SECRET` | `your-secret-key` | JWT secret (≥32 chars) |
| `JWT_ACCESS_TOKEN_EXPIRATION` | `900000` | Access token TTL (ms) — 15 min |
| `JWT_REFRESH_TOKEN_EXPIRATION` | `604800000` | Refresh token TTL (ms) — 7 days |
| `OTP_EXPIRATION_MINUTES` | `5` | OTP TTL |
| `OTP_MAX_ATTEMPTS` | `5` | Max OTP attempts |
| `LOGIN_MAX_ATTEMPTS` | `5` | Max failed login attempts |
| `LOGIN_LOCK_DURATION_MINUTES` | `30` | Account lock duration |
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP host |
| `EMAIL_USERNAME` | `your@gmail.com` | Sender email |
| `EMAIL_PASSWORD` | `app-password` | Gmail app password |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `123456` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `secret` | Cloudinary API secret |
| `VNPAY_TMNCODE` | `K7AYB02L` | VNPay merchant code |
| `VNPAY_SECRET_KEY` | `your-key` | VNPay secret key |

### Run Backend without Docker

```bash
cd Backend
./mvnw clean package -DskipTests
./mvnw spring-boot:run
# Server: http://localhost:8080/api/v1
```

### Run Frontend

```bash
cd FrontEnd
npm install
npm start
# App: http://localhost:3000
```

### Import Postman Collection

The `SQLScript/` folder includes 3 Postman collection versions ready to import:
- `FOOD_ORDER_SYSTEM.postman_collection.json` — v1
- `FOOD_ORDER_SYSTEM_V2.postman_collection` — v2
- `FOOD_ORDER_SYSTEM_V3.postman_collection` — v3 (latest)

---

## 🗄️ Database Schema

ERD diagram: [`SQLScript/sql_ecommerce.png`](./SQLScript/sql_ecommerce.png)

Sample data: [`SQLScript/Insert_Database.sql`](./SQLScript/Insert_Database.sql)

---

## ⚡ Technical Highlights

- **4-layer Account Security**: JWT Blacklist + Brute-force lock + OTP Rate Limit + BCrypt — each layer independent.
- **Async Email**: Spring `ApplicationEventPublisher` dispatches emails asynchronously — main request thread never blocked.
- **Redis Multi-purpose**: One Redis instance handles OTP TTL, Token Blacklist, Login Attempt counter, and Rate Limiting simultaneously.
- **JPA Specification**: Dynamic filtering for Voucher and Order queries — no hardcoded conditional SQL.
- **Docker Compose full-stack**: Single `docker-compose up` starts App + PostgreSQL + Redis with proper dependency ordering.
- **VNPay Full Flow**: Complete payment integration — generate URL → callback → verify signature → update order status → send confirmation email.

---

