# 🚀 Quick Start Guide

Hướng dẫn nhanh để bắt đầu với Security Lab trong vòng 5 phút.

## 📋 Yêu Cầu Hệ Thống

-   Node.js 14+
-   npm hoặc yarn
-   Chrome browser (cho automation)
-   Terminal/Command Prompt

## ⚡ Cài Đặt Nhanh

### 1. Clone Repository

```bash
git clone <repository-url>
cd lelel
```

### 2. Cài Đặt Dependencies

```bash
npm install
```

### 3. Chạy Server

**Cấu trúc mới (khuyến nghị):**

```bash
node server-new.js
```

**Cấu trúc cũ:**

```bash
node server.js
```

### 4. Truy Cập

Mở trình duyệt: http://localhost:3000

## 🎯 Thử Ngay

### SQL Injection Lab

1. Truy cập: http://localhost:3000/lab/sqli
2. Thử tìm kiếm: `' UNION SELECT id, flag FROM secret--`
3. Xem FLAG: `FLAG{SQL_1nj3ct10n_M4st3r}`

### Command Injection Lab

1. Truy cập: http://localhost:3000/lab/cmdi
2. Thử ping: `8.8.8.8; cat secret.txt`
3. Xem FLAG: `FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}`

### Authentication Bypass Lab

1. Truy cập: http://localhost:3000/lab/auth
2. Login: `user1` / `password1`
3. F12 → Application → Cookies → Sửa `auth` thành `admin:admin123`
4. Refresh → Xem FLAG: `FLAG{4uth_Byp4ss_C00k13_H4ck}`

## 🌟 Tính Năng Nổi Bật

### Chrome Auto-Login

-   Tự động mở Chrome khi phát hiện XSS
-   Đăng nhập admin và trigger XSS payload
-   Screenshot tự động

### Real-time Detection

-   Phát hiện XSS patterns trong comments
-   Auto-reset comments khi về trang chủ
-   Logging chi tiết

## 🔧 Troubleshooting

### Port đã được sử dụng

```bash
# Tìm process sử dụng port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Chrome không mở được

```bash
# Cài đặt Chrome dependencies (Ubuntu/Debian)
sudo apt-get install -y google-chrome-stable
```

### Database lỗi

```bash
# Xóa database cũ
rm lab.db

# Chạy lại server
node server-new.js
```

## 📚 Tài Liệu Tiếp Theo

-   [SQL Injection Lab](../labs/sql-injection.md)
-   [Command Injection Lab](../labs/command-injection.md)
-   [Authentication Bypass Lab](../labs/authentication-bypass.md)
-   [Architecture Guide](./architecture.md)

## 🎓 Mục Tiêu Học Tập

Sau khi hoàn thành Quick Start, bạn sẽ:

-   ✅ Hiểu cơ bản về web security vulnerabilities
-   ✅ Biết cách khai thác SQL Injection
-   ✅ Thực hành Command Injection
-   ✅ Học Authentication Bypass techniques
-   ✅ Trải nghiệm XSS automation

---

**Thời gian hoàn thành**: 5-10 phút  
**Độ khó**: Cơ bản  
**Yêu cầu**: Kiến thức cơ bản về web development
