# 🛒 Secure E-commerce Platform

<div align="right">
  <a href="./README.md">🇬🇧 English</a>
</div>

![Java](https://img.shields.io/badge/Java-17+-orange?logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-red?logo=redis)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

Nền tảng thương mại điện tử full-stack với hệ thống bảo mật đa lớp: xác thực email, OTP 2FA, chống brute-force, thanh toán VNPay và quản lý đơn hàng hoàn chỉnh.

---

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [API Endpoints](#api-endpoints)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)

---

## 🌟 Tổng quan

Ứng dụng web bán thực phẩm được xây dựng theo mô hình **Client-Server** với trọng tâm vào bảo mật và trải nghiệm người dùng:

- **Backend**: RESTful API với Spring Boot 3, xử lý toàn bộ business logic, bảo mật đa lớp và tích hợp thanh toán thực tế.
- **Frontend**: Single Page Application với React 19 + Ant Design, mang lại trải nghiệm mua sắm mượt mà.
- **Infrastructure**: Toàn bộ stack (App + PostgreSQL + Redis) container hóa với Docker Compose, chạy bằng 1 lệnh.

---

## ✨ Tính năng

### 🔐 Xác thực & Bảo mật đa lớp
- Đăng ký / Đăng nhập bằng email + mật khẩu (BCrypt).
- **Xác minh email** khi đăng ký — tài khoản chỉ được kích hoạt sau khi click link xác nhận.
- **OTP 2FA** qua email cho luồng quên mật khẩu — Redis TTL-based (5 phút), giới hạn số lần nhập sai.
- **Brute-force protection**: Khóa tài khoản tạm thời sau N lần đăng nhập sai liên tiếp (cấu hình linh hoạt).
- **JWT stateless**: Access Token (ngắn hạn) + Refresh Token (7 ngày) + Token Blacklist khi logout.
- **Rate Limiting** cho OTP: giới hạn số lần gửi per-minute và per-hour.

### 🛍️ Sản phẩm & Danh mục
- Quản lý sản phẩm với nhiều biến thể (Options Group + Options Values).
- Phân loại theo danh mục, phân trang và lọc sản phẩm.
- Upload ảnh sản phẩm lên **Cloudinary** (auto-resize, CDN delivery, tối đa 10MB).

### 🛒 Giỏ hàng & Đặt hàng
- Thêm/sửa/xóa sản phẩm khỏi giỏ hàng, chọn số lượng và biến thể.
- Checkout từ giỏ hàng hoặc đặt hàng trực tiếp (Admin).
- Theo dõi trạng thái đơn hàng (Order Status History).
- Quản lý thông tin giao hàng (User Information).

### 💳 Thanh toán
- Hỗ trợ **thanh toán tiền mặt (COD)**.
- Tích hợp cổng thanh toán thực tế **VNPay** (Sandbox) với callback xử lý kết quả.
- Tự động tạo **Invoice** và gửi email xác nhận đơn hàng sau khi thanh toán thành công.

### 🎟️ Voucher & Khuyến mãi
- Tạo và quản lý mã giảm giá — theo % hoặc số tiền cố định.
- Kiểm tra hạn sử dụng và số lần dùng tối đa.
- Lọc voucher động qua JPA Specification.

### 📧 Email Notification
- Gửi email xác minh tài khoản khi đăng ký.
- Gửi email chứa OTP khi quên mật khẩu.
- Gửi email xác nhận đơn hàng + hóa đơn sau khi thanh toán.

### 👨‍💼 Quản trị (Admin)
- Quản lý sản phẩm (tạo, cập nhật).
- Xem toàn bộ đơn hàng, tạo đơn hàng thay mặt khách.
- Quản lý voucher, phương thức thanh toán.

---

## 🏗️ Kiến trúc hệ thống

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
│  │  (Email async)    │   │  (CustomizedResponseEntity)  │  │
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

## 🛠️ Công nghệ sử dụng

### Backend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Java | 17+ | Ngôn ngữ chính |
| Spring Boot | 3.3.5 | Framework backend |
| Spring Security | 6.x | Xác thực & phân quyền |
| Spring Data JPA | 3.x | ORM, tương tác database |
| Spring Data Redis | 3.x | Cache, OTP, Token Blacklist |
| Spring Mail | 3.x | Gửi email xác minh & OTP |
| JWT (jjwt) | 0.12.3 | Stateless authentication |
| Cloudinary SDK | 1.38.0 | Upload & xử lý ảnh |
| VNPay | — | Cổng thanh toán |
| PostgreSQL | 17 | Cơ sở dữ liệu chính |
| Redis | 7 | Caching & session store |
| Docker / Compose | — | Containerization |
| Lombok | 1.18.36 | Giảm boilerplate |
| Maven | 3.9 | Build & dependency |

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 19 | UI framework |
| Redux Toolkit | 2.x | State management |
| React Query | 5.x | Server state & caching |
| React Router | 6.x | Client-side routing |
| Ant Design | 5.x | UI component library |
| Styled Components | 6.x | CSS-in-JS styling |
| React Slick | — | Image carousel |

---

## 📁 Cấu trúc dự án

```
ecommerce/
├── Backend/
│   ├── Dockerfile
│   ├── docker-compose.yml                    # Full stack: App + PostgreSQL + Redis
│   └── src/main/java/com/e_commerce/
│       ├── configuration/                    # Security, Redis, VNPay, Cloudinary config
│       ├── controller/                       # REST Controllers theo module
│       ├── dto/                              # Request & Response DTOs
│       ├── entity/                           # JPA Entities
│       ├── enums/                            # AccountRole, OrderStatus, VoucherType...
│       ├── event/                            # Async Events (email bất đồng bộ)
│       ├── exceptions/                       # GlobalExceptionHandler
│       ├── mapper/                           # Entity <-> DTO Mappers
│       ├── repository/                       # Spring Data JPA Repositories
│       ├── service/                          # Business Logic (Interface + Impl)
│       ├── specification/                    # JPA Specifications (dynamic query)
│       └── util/                             # JwtUtil, OtpUtil, VNPayUtil, LoginAttemptService
│
├── FrontEnd/
│   └── src/
│       ├── components/
│       ├── pages/                            # HomePage, ProductsPage, OrderPage, AdminPage
│       ├── redux/
│       ├── context/                          # AuthContext, ToastContext
│       ├── Hooks/
│       └── routes/
│
└── SQLScript/
    ├── sql_ecommerce.png                     # ERD diagram
    ├── Insert_Database.sql
    └── *.postman_collection.json
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:8080/api/v1`

| Module | Method | Endpoint | Mô tả |
|---|---|---|---|
| **Auth** | POST | `/auth/register` | Đăng ký tài khoản |
| | POST | `/auth/login` | Đăng nhập → JWT |
| | POST | `/auth/logout` | Đăng xuất (blacklist token) |
| | POST | `/auth/refresh-token` | Làm mới Access Token |
| | GET | `/auth/activate` | Kích hoạt tài khoản qua email |
| | POST | `/auth/forgot-password` | Gửi OTP quên mật khẩu |
| | POST | `/auth/reset-password` | Đặt lại mật khẩu sau OTP |
| **OTP** | POST | `/otp/resend` | Gửi lại OTP |
| **User Info** | GET | `/user-info/{accountId}` | Lấy thông tin giao hàng |
| | POST | `/user-info` | Tạo thông tin giao hàng |
| | PUT | `/user-info/{userInfoId}` | Cập nhật thông tin |
| **Product** | GET | `/products` | Danh sách sản phẩm (phân trang) |
| | GET | `/products/detail/{id}` | Chi tiết sản phẩm |
| | POST | `/products/create` | Tạo sản phẩm (Admin) |
| | PUT | `/products/update/{id}` | Cập nhật sản phẩm (Admin) |
| **Category** | GET | `/categories/all` | Tất cả danh mục |
| **Cart** | GET | `/cart-items` | Giỏ hàng hiện tại |
| | POST | `/cart-items/addCart` | Thêm vào giỏ hàng |
| | PUT | `/cart-items/{id}/quantity` | Cập nhật số lượng |
| | DELETE | `/cart-items/{cartId}` | Xóa item khỏi giỏ |
| | DELETE | `/cart-items/account` | Xóa toàn bộ giỏ hàng |
| **Order** | POST | `/orders/create` | Tạo đơn hàng từ giỏ |
| | GET | `/orders/all` | Xem tất cả đơn hàng (Admin) |
| | GET | `/order-status-history/{orderId}` | Lịch sử trạng thái đơn |
| **Payment** | GET | `/payments/pay` | Khởi tạo thanh toán (COD/VNPay) |
| | GET/POST | `/payments/vnpay/callback` | VNPay callback xử lý kết quả |
| **Voucher** | GET | `/vouchers` | Danh sách voucher |
| | POST | `/vouchers/create` | Tạo voucher (Admin) |
| | GET | `/vouchers/check/{code}` | Kiểm tra voucher hợp lệ |
| | DELETE | `/vouchers/delete/{id}` | Xóa voucher (Admin) |
| **Invoice** | POST | `/invoices/create` | Tạo hóa đơn |
| | GET | `/invoices` | Danh sách hóa đơn |

---

## 🚀 Cài đặt & Chạy dự án

### Yêu cầu
- Docker & Docker Compose
- Java 17+ (nếu chạy không dùng Docker)
- Node.js 18+ (cho Frontend)
- Tài khoản [Cloudinary](https://cloudinary.com) (free tier đủ dùng)
- Tài khoản [VNPay Sandbox](https://sandbox.vnpayment.vn) (optional)

### ⚡ Chạy toàn bộ Backend với Docker (khuyến nghị)

```bash
cd Backend

# 1. Tạo file .env
cp .env.example .env

# 2. Điền các giá trị vào .env (xem bảng bên dưới)
nano .env

# 3. Chạy toàn bộ stack (App + PostgreSQL + Redis)
docker-compose up -d

# Server: http://localhost:8080/api/v1
```

#### Các biến môi trường cần thiết

| Biến | Ví dụ | Mô tả |
|---|---|---|
| `DB_NAME` | `ecommerce` | Tên database |
| `DB_USERNAME` | `postgres` | Username DB |
| `DB_PASSWORD` | `yourpassword` | Password DB |
| `REDIS_HOST` | `redis` | Host Redis (service name trong Docker) |
| `REDIS_PORT` | `6379` | Port Redis |
| `JWT_ACCESS_TOKEN_SECRET` | `your-secret-key` | JWT secret (≥32 ký tự) |
| `JWT_ACCESS_TOKEN_EXPIRATION` | `900000` | Access token TTL (ms) — 15 phút |
| `JWT_REFRESH_TOKEN_EXPIRATION` | `604800000` | Refresh token TTL (ms) — 7 ngày |
| `OTP_EXPIRATION_MINUTES` | `5` | Thời gian hết hạn OTP |
| `OTP_MAX_ATTEMPTS` | `5` | Số lần nhập OTP tối đa |
| `LOGIN_MAX_ATTEMPTS` | `5` | Số lần đăng nhập sai tối đa |
| `LOGIN_LOCK_DURATION_MINUTES` | `30` | Thời gian khóa tài khoản |
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP host |
| `EMAIL_USERNAME` | `your@gmail.com` | Email gửi |
| `EMAIL_PASSWORD` | `app-password` | App password Gmail |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `123456` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `secret` | Cloudinary API secret |
| `VNPAY_TMNCODE` | `K7AYB02L` | VNPay merchant code |
| `VNPAY_SECRET_KEY` | `your-key` | VNPay secret key |

### Chạy không dùng Docker

```bash
cd Backend
./mvnw clean package -DskipTests
./mvnw spring-boot:run
# Server: http://localhost:8080/api/v1
```

### Chạy Frontend

```bash
cd FrontEnd
npm install
npm start
# App: http://localhost:3000
```

### Import Postman Collection

Thư mục `SQLScript/` có sẵn 3 phiên bản Postman Collection:
- `FOOD_ORDER_SYSTEM.postman_collection.json` — v1
- `FOOD_ORDER_SYSTEM_V2.postman_collection` — v2
- `FOOD_ORDER_SYSTEM_V3.postman_collection` — v3 (mới nhất)

---

## 🗄️ Database Schema

ERD diagram: [`SQLScript/sql_ecommerce.png`](./SQLScript/sql_ecommerce.png)

Dữ liệu mẫu: [`SQLScript/Insert_Database.sql`](./SQLScript/Insert_Database.sql)

---

## ⚡ Technical Highlights

- **Bảo mật 4 lớp**: JWT Blacklist + Brute-force lock + OTP Rate Limit + BCrypt — mỗi lớp hoạt động độc lập.
- **Async Email**: Spring `ApplicationEventPublisher` gửi email bất đồng bộ — không block request chính.
- **Redis đa mục đích**: Một Redis instance xử lý đồng thời OTP TTL, Token Blacklist, Login Attempt counter và Rate Limiting.
- **JPA Specification**: Dynamic query cho Voucher và Order filter — không cần viết query cứng.
- **Docker Compose full-stack**: Một lệnh `docker-compose up` khởi động App + PostgreSQL + Redis với dependency ordering.
- **VNPay full flow**: Tích hợp hoàn chỉnh — tạo URL → callback → verify → cập nhật đơn hàng → gửi email.

---
